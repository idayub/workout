"use strict";

/*
  MEU TREINO — HEVY (iOS) EDITION
  - Arnold Split atualizado (5 dias de treino + 2 de descanso, 28 exercícios)
  - Estética Gym-Floor Hevy iOS: Canvas #0E1116, Ação única Hevy Blue #1E6FFF
  - Tabela de Séries: SET / ANTERIOR / KG / REPS / ✓
  - Lavagem verde (#2FBF71 @ 16%) ao concluir a série
  - Badge PR Ouro (#F5B83D) dinâmico ao bater recorde de carga
  - Cronômetro de Duração ao vivo no topo (Hevy Blue)
  - Cálculo de Volume Total em tempo real (kg levantados)
  - Temporizador de descanso Hevy Pill com anel circular SVG
  - Mini-timer fixo (Dynamic Island style) ao rolar a página
  - Modal comemorativo ao Finalizar Treino
  - Persistência total em localStorage com suporte a ciclos anteriores
*/

/* =========================================================
   CONFIGURAÇÕES & CONSTANTES
   ========================================================= */

const STORAGE_KEY = "meu-treino-original-v5";
const THEME_KEY = "meu-treino-theme";

const DAYS = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo"
];

const DAY_LABELS = {
  segunda: "Treino A",
  terca: "Treino B",
  quarta: "Treino C",
  quinta: "Treino D",
  sexta: "Treino E",
  sabado: "Descanso",
  domingo: "Descanso"
};

const DAY_SHORT_LABELS = {
  segunda: "A",
  terca: "B",
  quarta: "C",
  quinta: "D",
  sexta: "E",
  sabado: "OFF",
  domingo: "OFF"
};

/* =========================================================
   CARREGAMENTO DINÂMICO DO PLANEJAMENTO (JSON)
   ========================================================= */

async function loadWorkoutsData() {
  try {
    const res = await fetch("./planejamento.json?v=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && data.segunda && Array.isArray(data.segunda.exercises)) {
        WORKOUTS = data;
        return true;
      }
    }
  } catch (err) {
    console.warn("Usando base de treinos embutida (offline/local):", err);
  }
  return false;
}

/* =========================================================
   BASE DE TREINO (FALLBACK EMBUTIDO / ARNOLD SPLIT)
   ========================================================= */

let WORKOUTS = {
  segunda: {
    title: "Treino A: Peito, Ombros e Tríceps",
    subtitle: "Início da semana com foco em empurrar, densidade peitoral e deltoides.",
    exercises: [
      {
        name: "Supino Inclinado com Halteres",
        sets: 4,
        reps: "6–10",
        rir: 1,
        rest: 180,
        technique: "Pirâmide crescente",
        cadence: "3-1-1-0",
        tip: "Pirâmide crescente: Aumente o peso dos halteres a cada série, diminuindo o número de repetições."
      },
      {
        name: "Supino Reto Máquina Articulada",
        sets: 4,
        reps: "8–12",
        rir: 1,
        rest: 150,
        technique: "Top set + back-off",
        cadence: "3-0-1-1",
        tip: "Top set + back-off: Faça a primeira série pesada até quase falhar. Reduza a carga em 20% para as 3 séries seguintes."
      },
      {
        name: "Crossover Polia Média",
        sets: 3,
        reps: "12–15",
        rir: 0,
        rest: 90,
        technique: "Drop Set",
        cadence: "2-0-2-1",
        tip: "Drop Set: Na última série, vá até a falha. Reduza o peso em 20% e faça até a falha de novo, sem descansar."
      },
      {
        name: "Voador (Peck Deck)",
        sets: 3,
        reps: "10–12",
        rir: 0,
        rest: 90,
        technique: "Rest-Pause",
        cadence: "2-1-2-1",
        tip: "Rest-Pause: Na última série, vá até a falha, descanse 10 segundos na máquina e faça mais repetições até travar."
      },
      {
        name: "Desenvolvimento com Halteres",
        sets: 4,
        reps: "8–10",
        rir: 1,
        rest: 120,
        technique: "Padrão",
        cadence: "3-0-1-0",
        tip: "Padrão: Controle a descida até a linha das orelhas antes de empurrar verticalmente."
      },
      {
        name: "Elevação Lateral com Halteres",
        sets: 4,
        reps: "12–20",
        rir: 0,
        rest: 75,
        technique: "Drop Set",
        cadence: "2-0-2-0",
        tip: "Drop Set: Na última série, falhe, reduza o peso e falhe de novo imediatamente."
      },
      {
        name: "Tríceps Testa na Polia (Corda)",
        sets: 4,
        reps: "10–15",
        rir: 1,
        rest: 90,
        technique: "Padrão",
        cadence: "3-0-1-1",
        tip: "Padrão: Cotovelos fixos e estenda completamente abrindo a corda no final."
      },
      {
        name: "Tríceps Francês Unilateral",
        sets: 3,
        reps: "10–12",
        rir: 0,
        rest: 90,
        technique: "Padrão",
        cadence: "2-1-1-0",
        tip: "Padrão: Alongamento completo da cabeça longa do tríceps com estabilidade do ombro."
      },
      {
        name: "Tríceps Pulldown (Barra V)",
        sets: 3,
        reps: "12–15",
        rir: 0,
        rest: 90,
        technique: "Isometria",
        cadence: "2-0-1-2",
        tip: "Isometria: Segure a barra embaixo por 2 segundos inteiros a cada repetição apertando o tríceps."
      }
    ]
  },

  terca: {
    title: "Treino B: Costas, Bíceps e Panturrilhas",
    subtitle: "Puxadas de alta intensidade, espessura dorsal e flexão plantar pesada.",
    exercises: [
      {
        name: "Puxada Alta Pegada Aberta",
        sets: 4,
        reps: "8–12",
        rir: 1,
        rest: 120,
        technique: "Padrão",
        cadence: "3-0-1-1",
        tip: "Padrão: Deprima as escápulas antes de puxar a barra em direção ao peito superior."
      },
      {
        name: "Remada Curvada com Halteres",
        sets: 4,
        reps: "6–10",
        rir: 1,
        rest: 150,
        technique: "Pirâmide crescente",
        cadence: "2-0-1-1",
        tip: "Pirâmide crescente: Aumente o peso a cada série, diminuindo as repetições."
      },
      {
        name: "Remada Articulada Unilateral",
        sets: 3,
        reps: "10–15",
        rir: 0,
        rest: 120,
        technique: "Pico de contração",
        cadence: "3-0-1-1",
        tip: "Pico de contração: Segure a carga no ponto máximo de puxada por 1 segundo inteiro."
      },
      {
        name: "Pulldown com Corda Polia Alta",
        sets: 3,
        reps: "12–15",
        rir: 0,
        rest: 90,
        technique: "Rest-Pause",
        cadence: "3-0-1-1",
        tip: "Rest-Pause: Na última série, falhe, respire 10 segundos e faça repetições extras até a falha."
      },
      {
        name: "Rosca Direta com Barra",
        sets: 4,
        reps: "8–12",
        rir: 1,
        rest: 120,
        technique: "Padrão",
        cadence: "3-0-1-0",
        tip: "Padrão: Cotovelos colados ao tronco e sem impulsão lombar."
      },
      {
        name: "Rosca Martelo com Halteres",
        sets: 3,
        reps: "10–15",
        rir: 1,
        rest: 90,
        technique: "Padrão",
        cadence: "2-0-1-0",
        tip: "Padrão: Fortalece braquial e braquiorradial com pegada neutra."
      },
      {
        name: "Rosca Scott Máquina",
        sets: 3,
        reps: "10–12",
        rir: 0,
        rest: 90,
        technique: "Drop Set",
        cadence: "3-1-1-1",
        tip: "Drop Set: Na última série, vá até a falha. Tire 20% do peso e falhe de novo sem descanso."
      },
      {
        name: "Panturrilha em Pé Máquina",
        sets: 5,
        reps: "10–15",
        rir: 0,
        rest: 90,
        technique: "Pausa no alongamento",
        cadence: "2-2-1-1",
        tip: "Pausa no alongamento: Desça o calcanhar e segure alongando por 2 segundos antes de subir."
      },
      {
        name: "Panturrilha no Leg Press",
        sets: 4,
        reps: "12–20",
        rir: 0,
        rest: 90,
        technique: "Rest-Pause",
        cadence: "2-1-1-1",
        tip: "Rest-Pause: Na última série, falhe, descanse 10s e falhe novamente."
      }
    ]
  },

  quarta: {
    title: "Treino C: Braços, Deltoide Posterior e Panturrilhas",
    subtitle: "Super-compensação de bíceps, tríceps e deltoides posteriores.",
    exercises: [
      {
        name: "Rosca Inclinada com Halteres",
        sets: 4,
        reps: "10–12",
        rir: 1,
        rest: 90,
        technique: "Padrão",
        cadence: "3-1-1-0",
        tip: "Padrão: Deite a 45° para alongamento máximo da cabeça longa do bíceps."
      },
      {
        name: "Rosca Concentrada",
        sets: 3,
        reps: "10–12",
        rir: 1,
        rest: 90,
        technique: "Padrão",
        cadence: "2-0-1-1",
        tip: "Padrão: Apoio no interior da coxa, sem assistência corporal."
      },
      {
        name: "Rosca Aranha (Spider Curl)",
        sets: 3,
        reps: "12–15",
        rir: 0,
        rest: 90,
        technique: "Myo-Reps",
        cadence: "2-0-1-1",
        tip: "Myo-Reps: Faça a série até perto da falha. Respire 5 vezes e faça 3 a 5 reps. Repita até falhar."
      },
      {
        name: "Tríceps Supinado (Polia/Cabo)",
        sets: 4,
        reps: "10–12",
        rir: 1,
        rest: 90,
        technique: "Padrão",
        cadence: "2-0-1-1",
        tip: "Padrão: Foco na extensão pura do cotovelo com pegada firme."
      },
      {
        name: "Tríceps Coice Unilateral",
        sets: 3,
        reps: "12–15",
        rir: 1,
        rest: 75,
        technique: "Padrão",
        cadence: "2-0-1-1",
        tip: "Padrão: Braço alinhado ao tronco, aperte no final do movimento."
      },
      {
        name: "Mergulho em Máquina/Paralelas",
        sets: 3,
        reps: "8–12",
        rir: 0,
        rest: 120,
        technique: "Cluster Set",
        cadence: "3-1-1-0",
        tip: "Cluster Set: Na última série, faça repetições até quase falhar, descanse 15s e faça mais 3 a 5 repetições."
      },
      {
        name: "Crucifixo Inverso (Máquina)",
        sets: 4,
        reps: "15–20",
        rir: 0,
        rest: 90,
        technique: "Rest-Pause",
        cadence: "2-0-1-1",
        tip: "Rest-Pause: Na última série, vá até a falha, descanse 10 segundos e faça mais repetições até a falha."
      },
      {
        name: "Remada Alta Pegada Aberta",
        sets: 3,
        reps: "10–15",
        rir: 0,
        rest: 90,
        technique: "Drop Set",
        cadence: "2-0-1-1",
        tip: "Drop Set: Na última série, falhe, reduza a carga e falhe novamente."
      },
      {
        name: "Panturrilha Sentado (Solear)",
        sets: 5,
        reps: "12–20",
        rir: 0,
        rest: 90,
        technique: "Padrão",
        cadence: "2-1-1-1",
        tip: "Padrão: Amplitude máxima com foco na flexão plantar completa."
      },
      {
        name: "Panturrilha Unilateral com Halter",
        sets: 3,
        reps: "10–15",
        rir: 1,
        rest: 75,
        technique: "Padrão",
        cadence: "2-1-1-1",
        tip: "Padrão: Exercício unilateral para equilíbrio de forças entre os membros."
      }
    ]
  },

  quinta: {
    title: "Treino D: Pernas Completas (O Dia Único)",
    subtitle: "Treino lendário de membros inferiores: quadríceps, posteriores e glúteos.",
    exercises: [
      {
        name: "Cadeira Extensora",
        sets: 4,
        reps: "10–12",
        rir: 0,
        rest: 90,
        technique: "Drop Set Duplo",
        cadence: "3-1-1-1",
        tip: "Drop Set Duplo: Na última, falhe absoluta. Tire 20%, falhe de novo. Tire 20% e falhe pela terceira vez sem descanso."
      },
      {
        name: "Leg Press 45°",
        sets: 4,
        reps: "8–10",
        rir: 0,
        rest: 180,
        technique: "Rest-Pause",
        cadence: "4-0-1-0",
        tip: "Rest-Pause: Na última série, trave na falha. Respire 15 segundos e faça o máximo de repetições extras."
      },
      {
        name: "Agachamento Hack",
        sets: 3,
        reps: "10–12",
        rir: 0,
        rest: 180,
        technique: "Cluster Set",
        cadence: "3-1-1-0",
        tip: "Cluster Set: Na última série, vá até perto da falha, descanse 15s na máquina e faça mais 4 reps."
      },
      {
        name: "Afundo Búlgaro com Halteres",
        sets: 3,
        reps: "8–12",
        rir: 1,
        rest: 120,
        technique: "Padrão",
        cadence: "3-0-1-0",
        tip: "Padrão: Apoie o peito do pé de trás no banco. Desça com controle focando no calcanhar da frente."
      },
      {
        name: "Mesa Flexora",
        sets: 4,
        reps: "8–12",
        rir: 0,
        rest: 120,
        technique: "Drop Set Duplo",
        cadence: "3-0-1-1",
        tip: "Drop Set Duplo: Falhe, reduza o peso 20%, falhe, reduza mais 20% e falhe uma terceira vez."
      },
      {
        name: "Cadeira Flexora",
        sets: 3,
        reps: "10–15",
        rir: 0,
        rest: 90,
        technique: "Myo-Reps",
        cadence: "2-0-1-1",
        tip: "Myo-Reps: Série de ativação até a falha, respire 5 vezes, faça mini-séries de 3 reps até travar de vez."
      },
      {
        name: "Stiff com Halteres",
        sets: 4,
        reps: "8–12",
        rir: 1,
        rest: 150,
        technique: "Padrão",
        cadence: "4-1-1-0",
        tip: "Padrão: Desça lentamente controlando a força com o posterior e glúteos."
      },
      {
        name: "Elevação Pélvica Máquina/Barra",
        sets: 3,
        reps: "10–12",
        rir: 1,
        rest: 120,
        technique: "Pausa na contração",
        cadence: "2-0-1-2",
        tip: "Pausa na contração: Segure a ponte no alto contraindo o glúteo por 2 segundos."
      }
    ]
  },

  sexta: {
    title: "Treino E: Ombros e Abdômen",
    subtitle: "Largura clavicular, deltoides 3D e fortalecimento pesado de core.",
    exercises: [
      {
        name: "Desenvolvimento Máquina",
        sets: 4,
        reps: "8–12",
        rir: 1,
        rest: 120,
        technique: "Padrão",
        cadence: "3-0-1-0",
        tip: "Padrão: Empurre com controle, evitando travar bruscamente os cotovelos no topo."
      },
      {
        name: "Elevação Lateral na Polia",
        sets: 4,
        reps: "12–15",
        rir: 0,
        rest: 90,
        technique: "Myo-Reps",
        cadence: "2-0-1-0",
        tip: "Myo-Reps: Faça a série até perto da falha. Respire 5 vezes e faça mini-séries até não conseguir 3 reps."
      },
      {
        name: "Elevação Lateral Inclinada",
        sets: 3,
        reps: "12–15",
        rir: 1,
        rest: 75,
        technique: "Padrão",
        cadence: "2-0-2-0",
        tip: "Padrão: Tronco levemente inclinado para foco na porção lateral do deltoide."
      },
      {
        name: "Elevação Frontal com Corda (Polia)",
        sets: 3,
        reps: "10–12",
        rir: 0,
        rest: 90,
        technique: "Rest-Pause",
        cadence: "2-0-1-1",
        tip: "Rest-Pause: Na última série, vá até a falha, descanse 10 segundos e faça mais repetições até a falha."
      },
      {
        name: "Abdominal na Polia Alta",
        sets: 4,
        reps: "10–15",
        rir: 0,
        rest: 90,
        technique: "Progressão de carga",
        cadence: "2-1-2-1",
        tip: "Progressão de carga: Aumente a placa assim que bater 15 reps."
      },
      {
        name: "Abdominal Infra Declinado",
        sets: 3,
        reps: "15–20",
        rir: 1,
        rest: 75,
        technique: "Padrão",
        cadence: "2-0-1-0",
        tip: "Padrão: Eleve o quadril no final da subida contraindo a região infra-abdominal."
      },
      {
        name: "Prancha Frontal",
        sets: 3,
        reps: "Máx",
        rir: 0,
        rest: 60,
        technique: "Falha isométrica",
        cadence: "Isometria",
        tip: "Falha isométrica: Segure a posição até não suportar mais."
      },
      {
        name: "Roda Abdominal (Ab Wheel)",
        sets: 3,
        reps: "8–15",
        rir: 0,
        rest: 90,
        technique: "Padrão",
        cadence: "4-0-1-0",
        tip: "Padrão: Estenda o corpo mantendo a curvatura natural e puxe com a força do abdômen."
      }
    ]
  },

  sabado: {
    title: "Descanso ou Recuperação Ativa",
    subtitle: "Cardio leve, caminhada ou mobilidade articular.",
    exercises: []
  },

  domingo: {
    title: "Descanso Total",
    subtitle: "Recuperação completa para reiniciar o ciclo com força máxima.",
    exercises: []
  }
};

/* =========================================================
   ESTADO DO APLICATIVO
   ========================================================= */

const state = {
  selectedDay: "segunda",
  completed: {},
  loads: {},
  reps: {},
  exerciseLoads: {},
  extraSets: {},
  notes: {},
  vibration: true,
  workoutStartTime: null,
  workoutSeconds: 0,

  timer: {
    status: "idle",
    duration: 0,
    remaining: 0,
    endAt: null,
    exerciseName: ""
  }
};

/* =========================================================
   ELEMENTOS DOM
   ========================================================= */

const $ = (selector) => document.querySelector(selector);

const elements = {
  selectedDayTitle: $("#selectedDayTitle"),
  sessionSubtitle: $("#sessionSubtitle"),
  sessionPillTag: $("#sessionPillTag"),

  finishWorkoutBtn: $("#finishWorkoutBtn"),
  workoutDuration: $("#workoutDuration"),
  workoutVolume: $("#workoutVolume"),
  workoutSets: $("#workoutSets"),

  dayTabs: $("#dayTabs"),

  timerCard: $("#timerCard"),
  timerExercise: $("#timerExercise"),
  timerDisplay: $("#timerDisplay"),
  mainTimerRingProgress: $("#mainTimerRingProgress"),
  minus15TimerButton: $("#minus15TimerButton"),
  plus15TimerButton: $("#plus15TimerButton"),
  pauseTimerButton: $("#pauseTimerButton"),
  resumeTimerButton: $("#resumeTimerButton"),
  skipTimerButton: $("#skipTimerButton"),

  stickyMiniTimer: $("#stickyMiniTimer"),
  miniTimerJumpBtn: $("#miniTimerJumpBtn"),
  miniTimerDisplay: $("#miniTimerDisplay"),
  miniTimerRingProgress: $("#miniTimerRingProgress"),
  miniTimerToggleBtn: $("#miniTimerToggleBtn"),
  miniTimerToggleIcon: $("#miniTimerToggleIcon"),
  miniTimerSkipBtn: $("#miniTimerSkipBtn"),

  structureSection: $("#structureSection"),
  workoutStructureBar: $("#workoutStructureBar"),
  resetDayButton: $("#resetDayButton"),

  workoutList: $("#workoutList"),
  dayNotes: $("#dayNotes"),

  vibrationToggle: $("#vibrationToggle"),
  notificationPermissionButton: $("#notificationPermissionButton"),
  toast: $("#toast"),
  notificationMessage: $("#notificationMessage"),

  themeToggle: $("#themeToggle"),
  themeIcon: $("#themeIcon"),

  workoutSummaryModal: $("#workoutSummaryModal"),
  modalScrim: $("#modalScrim"),
  closeSummaryBtn: $("#closeSummaryBtn"),
  summaryRoutineName: $("#summaryRoutineName"),
  summaryDuration: $("#summaryDuration"),
  summaryVolume: $("#summaryVolume"),
  summarySets: $("#summarySets"),
  summaryPrCount: $("#summaryPrCount"),

  // Cadence Modal elements
  cadenceModal: $("#cadenceModal"),
  cadenceModalScrim: $("#cadenceModalScrim"),
  closeCadenceBtn: $("#closeCadenceBtn"),
  cadenceModalBadge: $("#cadenceModalBadge"),
  cadenceModalTitle: $("#cadenceModalTitle"),
  cadenceModalSubtitle: $("#cadenceModalSubtitle"),
  cadenceFormulaHeader: $("#cadenceFormulaHeader"),
  cadenceBreakdownCard: $("#cadenceBreakdownCard"),
  trainingMethodsList: $("#trainingMethodsList"),

  // Execution Coach Modal elements
  executionModal: $("#executionModal"),
  executionModalScrim: $("#executionModalScrim"),
  closeExecutionBtn: $("#closeExecutionBtn"),
  execCadenceBadge: $("#execCadenceBadge"),
  execRirBadge: $("#execRirBadge"),
  executionModalTitle: $("#executionModalTitle"),
  executionModalSubtitle: $("#executionModalSubtitle"),
  coachMovingWeight: $("#coachMovingWeight"),
  coachPhasePill: $("#coachPhasePill"),
  coachPhaseIcon: $("#coachPhaseIcon"),
  coachPhaseLabel: $("#coachPhaseLabel"),
  coachPhaseTimer: $("#coachPhaseTimer"),
  coachPhaseProgressBar: $("#coachPhaseProgressBar"),
  coachRepCounter: $("#coachRepCounter"),
  coachCadenceFormula: $("#coachCadenceFormula"),
  coachSoundToggle: $("#coachSoundToggle"),
  coachSoundIcon: $("#coachSoundIcon"),
  coachStartPauseBtn: $("#coachStartPauseBtn"),
  coachStartIcon: $("#coachStartIcon"),
  coachResetBtn: $("#coachResetBtn"),
  coachTechniqueText: $("#coachTechniqueText"),
  cueEccentric: $("#cueEccentric"),
  cueStretch: $("#cueStretch"),
  cueConcentric: $("#cueConcentric"),
  cuePeak: $("#cuePeak")
};

let timerInterval = null;
let workoutDurationInterval = null;
let isTimerCardVisible = true;
let audioContext = null;
let toastTimeout = null;

/* =========================================================
   PERSISTÊNCIA (LOCALSTORAGE)
   ========================================================= */

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

    const todayMap = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado"
    ];
    const currentDayKey = todayMap[new Date().getDay()];

    state.selectedDay = saved.selectedDay || currentDayKey || "segunda";
    state.completed = saved.completed || {};
    state.loads = saved.loads || {};
    state.reps = saved.reps || {};
    state.exerciseLoads = saved.exerciseLoads || {};
    state.extraSets = {};
    state.notes = saved.notes || {};
    state.vibration = saved.vibration !== false;
    state.workoutStartTime = saved.workoutStartTime || null;
    state.workoutSeconds = saved.workoutSeconds || 0;

    if (saved.timer) {
      state.timer = {
        ...state.timer,
        ...saved.timer
      };
    }
  } catch (error) {
    console.warn("Não foi possível restaurar o estado:", error);
  }

  if (elements.vibrationToggle) {
    elements.vibrationToggle.checked = state.vibration;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* =========================================================
   HELPERS & CÁLCULOS DO TREINO
   ========================================================= */

function getWorkout(day = state.selectedDay) {
  return WORKOUTS[day] || {
    title: "Descanso",
    subtitle: "Recuperação.",
    exercises: []
  };
}

function getSetKey(day, exerciseIndex, setIndex) {
  return `${day}-${exerciseIndex}-${setIndex}`;
}

function getExerciseKey(day, exerciseIndex) {
  return `${day}-${exerciseIndex}`;
}

function getExerciseTotalSets(day, exerciseIndex, baseSets) {
  return baseSets;
}

function getSetLoad(day, exerciseIndex, setIndex) {
  const key = getSetKey(day, exerciseIndex, setIndex);
  return (state.loads && state.loads[key]) || "";
}

function getSetReps(day, exerciseIndex, setIndex) {
  const key = getSetKey(day, exerciseIndex, setIndex);
  return (state.reps && state.reps[key]) || "";
}

function updateSetLoad(day, exerciseIndex, setIndex, loadValue) {
  if (!state.loads) state.loads = {};
  if (!state.exerciseLoads) state.exerciseLoads = {};

  const key = getSetKey(day, exerciseIndex, setIndex);
  const cleanVal = String(loadValue || "").trim();

  if (cleanVal) {
    state.loads[key] = cleanVal;

    const exKey = getExerciseKey(day, exerciseIndex);
    if (!state.exerciseLoads[exKey]) {
      state.exerciseLoads[exKey] = { previous: "", current: cleanVal };
    } else {
      state.exerciseLoads[exKey].current = cleanVal;
    }
  } else {
    delete state.loads[key];
  }

  saveState();
  updateLiveMetrics();
}

function updateSetReps(day, exerciseIndex, setIndex, repsValue) {
  if (!state.reps) state.reps = {};
  const key = getSetKey(day, exerciseIndex, setIndex);
  const cleanVal = String(repsValue || "").trim();

  if (cleanVal) {
    state.reps[key] = cleanVal;
  } else {
    delete state.reps[key];
  }

  saveState();
  updateLiveMetrics();
}

function getExerciseLoads(day, exerciseIndex) {
  const exKey = getExerciseKey(day, exerciseIndex);
  return (state.exerciseLoads && state.exerciseLoads[exKey]) || { previous: "", current: "" };
}

function isSetCompleted(day, exerciseIndex, setIndex) {
  return Boolean(state.completed[getSetKey(day, exerciseIndex, setIndex)]);
}

function updateSet(day, exerciseIndex, setIndex, completed) {
  const key = getSetKey(day, exerciseIndex, setIndex);

  if (completed) {
    state.completed[key] = true;
    if (!state.workoutStartTime) {
      state.workoutStartTime = Date.now();
    }
  } else {
    delete state.completed[key];
  }

  saveState();
  updateLiveMetrics();
}

/* =========================================================
   VOLUME TOTAL & MÉTRICAS AO VIVO (HEVY HEADER)
   ========================================================= */

function parseRepsNumber(repsStr) {
  if (!repsStr) return 10;
  const match = repsStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 10;
}

function calculateWorkoutVolume(day = state.selectedDay) {
  const workout = getWorkout(day);
  let totalVolume = 0;
  let prCount = 0;

  workout.exercises.forEach((exercise, exerciseIndex) => {
    const totalSets = getExerciseTotalSets(day, exerciseIndex, exercise.sets);
    const exLoads = getExerciseLoads(day, exerciseIndex);
    const prevWeight = parseFloat(exLoads.previous) || 0;
    let exerciseMaxLogged = 0;

    for (let setIndex = 0; setIndex < totalSets; setIndex += 1) {
      if (isSetCompleted(day, exerciseIndex, setIndex)) {
        const rawWeight = getSetLoad(day, exerciseIndex, setIndex) || exLoads.previous || "0";
        const weight = parseFloat(rawWeight.replace(",", ".")) || 0;

        const rawReps = getSetReps(day, exerciseIndex, setIndex);
        const reps = rawReps ? parseInt(rawReps, 10) || 10 : parseRepsNumber(exercise.reps);

        totalVolume += weight * reps;

        if (weight > exerciseMaxLogged) {
          exerciseMaxLogged = weight;
        }
      }
    }

    if (exerciseMaxLogged > prevWeight && prevWeight > 0) {
      prCount += 1;
    }
  });

  return { totalVolume: Math.round(totalVolume), prCount };
}

function getProgress(day = state.selectedDay) {
  const workout = getWorkout(day);
  let totalSets = 0;
  let completedSets = 0;

  workout.exercises.forEach((exercise, exerciseIndex) => {
    const setsCount = getExerciseTotalSets(day, exerciseIndex, exercise.sets);
    totalSets += setsCount;

    for (let setIndex = 0; setIndex < setsCount; setIndex += 1) {
      if (isSetCompleted(day, exerciseIndex, setIndex)) {
        completedSets += 1;
      }
    }
  });

  return {
    totalSets,
    completedSets,
    percent: totalSets ? Math.round((completedSets / totalSets) * 100) : 0
  };
}

function updateLiveMetrics() {
  const progress = getProgress();
  const { totalVolume } = calculateWorkoutVolume();

  if (elements.workoutVolume) {
    elements.workoutVolume.textContent = `${totalVolume.toLocaleString("pt-BR")} kg`;
  }

  if (elements.workoutSets) {
    elements.workoutSets.textContent = `${progress.completedSets} / ${progress.totalSets}`;
  }
}

/* =========================================================
   LIVE WORKOUT DURATION TIMER
   ========================================================= */

function formatDuration(seconds) {
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startDurationTimer() {
  if (workoutDurationInterval) {
    clearInterval(workoutDurationInterval);
  }

  workoutDurationInterval = setInterval(() => {
    if (state.workoutStartTime) {
      const elapsed = Math.floor((Date.now() - state.workoutStartTime) / 1000);
      state.workoutSeconds = elapsed;
    } else {
      state.workoutSeconds = state.workoutSeconds || 0;
    }

    if (elements.workoutDuration) {
      elements.workoutDuration.textContent = formatDuration(state.workoutSeconds);
    }
  }, 1000);
}

/* =========================================================
   FORMATADORES & ACESSIBILIDADE
   ========================================================= */

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatRest(seconds) {
  if (!seconds) return "sem descanso";
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs ? `${mins}m ${secs}s` : `${mins} min`;
  }
  return `${seconds}s`;
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function announce(message) {
  if (!elements.notificationMessage) return;
  elements.notificationMessage.textContent = "";
  window.setTimeout(() => {
    elements.notificationMessage.textContent = message;
  }, 20);
}

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2800);
}

/* =========================================================
   RENDERIZAÇÃO DO APP
   ========================================================= */

function getExerciseCategory(name) {
  const n = name.toLowerCase();
  if (n.includes("crucifixo inverso") || n.includes("remada alta")) {
    return { code: "OM", name: "Ombros", colorClass: "segment-ombros" };
  }
  if (n.includes("supino") || n.includes("crossover") || n.includes("peito") || n.includes("crucifixo") || n.includes("voador") || n.includes("peck deck")) {
    return { code: "PT", name: "Peito", colorClass: "segment-peito" };
  }
  if (n.includes("ombro") || n.includes("elevação") || n.includes("face pull") || n.includes("deltoide") || n.includes("desenvolvimento")) {
    return { code: "OM", name: "Ombros", colorClass: "segment-ombros" };
  }
  if (n.includes("tríceps") || n.includes("triceps") || n.includes("coice") || n.includes("testa") || n.includes("mergulho") || n.includes("pulldown (barra v)")) {
    return { code: "TR", name: "Tríceps", colorClass: "segment-triceps" };
  }
  if (n.includes("puxada") || n.includes("remada") || n.includes("costas") || n.includes("barra fixa") || n.includes("dorsal") || n.includes("pulldown")) {
    return { code: "CO", name: "Costas", colorClass: "segment-costas" };
  }
  if (n.includes("rosca") || n.includes("bíceps") || n.includes("biceps") || n.includes("concentrada") || n.includes("scott") || n.includes("aranha") || n.includes("spider")) {
    return { code: "BI", name: "Bíceps", colorClass: "segment-biceps" };
  }
  if (n.includes("agachamento") || n.includes("leg press") && !n.includes("panturrilha") || n.includes("extensora") || n.includes("búlgaro") || n.includes("flexora") || n.includes("stiff") || n.includes("pélvica") || n.includes("perna")) {
    return { code: "PE", name: "Pernas", colorClass: "segment-pernas" };
  }
  if (n.includes("panturrilha") || n.includes("solear")) {
    return { code: "PA", name: "Panturrilhas", colorClass: "segment-panturrilhas" };
  }
  if (n.includes("abdominal") || n.includes("prancha") || n.includes("core") || n.includes("ab wheel") || n.includes("roda")) {
    return { code: "AB", name: "Abdômen", colorClass: "segment-abdomen" };
  }
  return { code: "TR", name: "Treino", colorClass: "segment-peito" };
}

function getWeekDaysData() {
  const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda
  const adjustedToday = todayIndex === 0 ? 6 : todayIndex - 1; // 0 = Segunda, 6 = Domingo

  const curr = new Date();
  const first = curr.getDate() - adjustedToday;

  return DAYS.map((dayKey, index) => {
    const d = new Date(curr.setDate(first + index));
    return {
      key: dayKey,
      weekday: DAY_SHORT_LABELS[dayKey],
      dateNumber: d.getDate(),
      isToday: index === adjustedToday
    };
  });
}

function renderTabs() {
  if (!elements.dayTabs) return;
  elements.dayTabs.innerHTML = "";
  const weekData = getWeekDaysData();

  weekData.forEach((item) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "hevy-day-cell";
    cell.setAttribute("aria-label", `Treino de ${DAY_LABELS[item.key]}`);

    const progress = getProgress(item.key);
    const workout = getWorkout(item.key);
    const hasExercises = workout.exercises.length > 0;

    if (item.key === state.selectedDay) {
      cell.classList.add("selected");
    }
    if (progress.totalSets > 0 && progress.completedSets === progress.totalSets) {
      cell.classList.add("state-done");
    } else if (!hasExercises) {
      cell.classList.add("state-rest");
    }

    const isWorkout = hasExercises;
    cell.innerHTML = `
      <span class="hevy-day-weekday">${isWorkout ? "TREINO" : "OFF"}</span>
      <span class="hevy-day-date">${item.weekday}</span>
    `;

    cell.addEventListener("click", () => {
      state.selectedDay = item.key;
      saveState();
      render();
    });

    elements.dayTabs.appendChild(cell);
  });
}

function renderHeader() {
  const workout = getWorkout();
  const isToday = getWeekDaysData().find((d) => d.key === state.selectedDay)?.isToday;

  if (elements.sessionPillTag) {
    elements.sessionPillTag.textContent = isToday
      ? `ARNOLD SPLIT · HOJE`
      : `ARNOLD SPLIT · ${DAY_LABELS[state.selectedDay].toUpperCase()}`;
  }

  if (elements.selectedDayTitle) {
    elements.selectedDayTitle.textContent = workout.title;
  }

  if (elements.sessionSubtitle) {
    elements.sessionSubtitle.textContent = workout.subtitle;
  }

  updateLiveMetrics();
}

function renderStructureBar() {
  if (!elements.workoutStructureBar) return;
  elements.workoutStructureBar.innerHTML = "";
  const workout = getWorkout();

  if (!workout.exercises.length) {
    elements.workoutStructureBar.innerHTML = `
      <div class="structure-segment segment-descanso" style="flex-grow: 1;">
        DESCANSO & RECUPERAÇÃO ATIVA
      </div>
    `;
    return;
  }

  const groupSets = {};
  let totalSets = 0;

  workout.exercises.forEach((ex, exerciseIndex) => {
    const cat = getExerciseCategory(ex.name);
    const setsCount = getExerciseTotalSets(state.selectedDay, exerciseIndex, ex.sets);
    if (!groupSets[cat.name]) {
      groupSets[cat.name] = {
        name: cat.name,
        colorClass: cat.colorClass,
        sets: 0
      };
    }
    groupSets[cat.name].sets += setsCount;
    totalSets += setsCount;
  });

  Object.values(groupSets).forEach((group) => {
    const percent = Math.round((group.sets / totalSets) * 100);
    const seg = document.createElement("div");
    seg.className = `structure-segment ${group.colorClass}`;
    seg.style.flexGrow = group.sets;
    seg.textContent = `${group.name.toUpperCase()} (${group.sets})`;
    seg.title = `${group.name}: ${group.sets} séries (${percent}%)`;
    elements.workoutStructureBar.appendChild(seg);
  });
}

function renderWorkout() {
  const workout = getWorkout();

  if (elements.dayNotes) {
    elements.dayNotes.value = state.notes[state.selectedDay] || "";
  }

  if (!elements.workoutList) return;
  elements.workoutList.innerHTML = "";

  if (!workout.exercises.length) {
    elements.workoutList.innerHTML = `
      <article class="hevy-card">
        <div class="hevy-card-top">
          <div class="hevy-card-thumb">💤</div>
          <div class="hevy-card-title-col">
            <h2 class="hevy-exercise-name" style="color: var(--text-primary);">Dia de Recuperação</h2>
            <p class="hevy-exercise-sub">Descanso muscular completo ou mobilidade suave</p>
          </div>
        </div>
        <p class="hevy-exercise-tip">
          O descanso faz parte do treino: durma bem, hidrate-se e recupere suas fibras para a próxima sessão pesada.
        </p>
      </article>
    `;
    return;
  }

  workout.exercises.forEach((exercise, exerciseIndex) => {
    const totalSets = getExerciseTotalSets(state.selectedDay, exerciseIndex, exercise.sets);
    const exLoads = getExerciseLoads(state.selectedDay, exerciseIndex);
    const prevWeight = parseFloat(exLoads.previous) || 0;

    let completedSetsCount = 0;
    let exerciseMaxLogged = 0;

    for (let s = 0; s < totalSets; s += 1) {
      if (isSetCompleted(state.selectedDay, exerciseIndex, s)) {
        completedSetsCount += 1;
        const load = parseFloat(getSetLoad(state.selectedDay, exerciseIndex, s)) || 0;
        if (load > exerciseMaxLogged) {
          exerciseMaxLogged = load;
        }
      }
    }

    const isPR = exerciseMaxLogged > prevWeight && prevWeight > 0;

    const card = document.createElement("article");
    card.className = "hevy-exercise-card";
    if (completedSetsCount === totalSets && totalSets > 0) {
      card.classList.add("all-completed");
    }

    const rirClass = exercise.rir === 0 ? "badge-rir rir-0" : "badge-rir";
    const rirText = exercise.rir !== undefined
      ? `<span class="${rirClass}">RIR ${exercise.rir}${exercise.rir === 0 ? " (Falha)" : ""}</span>`
      : "";

    const cadenceText = exercise.cadence && exercise.cadence !== "N/A"
      ? `<button type="button" class="badge-cadence cadence-clickable-pill" data-exercise="${exerciseIndex}" title="Consultar cadência ${escapeHTML(exercise.cadence)}">⏱️ ${escapeHTML(exercise.cadence)}</button>`
      : "";

    const prBadgeHTML = isPR
      ? `<div class="hevy-pr-badge">★ NOVO RECORDE · ${exerciseMaxLogged} kg</div>`
      : "";

    card.innerHTML = `
      <div class="hevy-card-top">
        <div class="hevy-card-thumb">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 5.57 14.14 14.14 5.57 17.71 9.14 19.14 7.71 20.57 9.14 22 7.71l-1.43-1.43z"/>
          </svg>
        </div>

        <div class="hevy-card-title-col">
          <h2 class="hevy-exercise-name exercise-clickable-title" data-exercise="${exerciseIndex}" title="Ver animação de execução da cadência">
            ${escapeHTML(exercise.name)}
            <span class="exercise-demo-icon" aria-hidden="true">▶</span>
          </h2>
          <p class="hevy-exercise-sub">${totalSets} séries · ${escapeHTML(exercise.reps)} · descanso ${formatRest(exercise.rest)}</p>
          <div class="hevy-exercise-badges">
            ${rirText}
            ${cadenceText}
            <span class="badge-tech">${escapeHTML(exercise.technique)}</span>
          </div>
        </div>

        <button class="hevy-card-more" type="button" aria-label="Mais opções">⋯</button>
      </div>

      <p class="hevy-exercise-tip">${escapeHTML(exercise.tip)}</p>

      ${prBadgeHTML}

      <!-- HEVY SET TABLE -->
      <div class="hevy-set-table">
        <div class="hevy-table-header">
          <span class="hevy-col-head col-set">SET</span>
          <span class="hevy-col-head col-prev">ANTERIOR</span>
          <span class="hevy-col-head col-kg">KG</span>
          <span class="hevy-col-head col-reps">REPS</span>
          <span class="hevy-col-head col-check">✓</span>
        </div>

        <div class="hevy-set-rows"></div>
      </div>
    `;

    const setRowsContainer = card.querySelector(".hevy-set-rows");
    const defaultRepsNum = parseRepsNumber(exercise.reps);
    const previousLabelText = exLoads.previous ? `${exLoads.previous} × ${defaultRepsNum}` : "—";

    for (let setIndex = 0; setIndex < totalSets; setIndex += 1) {
      const checked = isSetCompleted(state.selectedDay, exerciseIndex, setIndex);
      const currentLoad = getSetLoad(state.selectedDay, exerciseIndex, setIndex);
      const currentReps = getSetReps(state.selectedDay, exerciseIndex, setIndex);

      const row = document.createElement("div");
      row.className = "hevy-set-row";
      if (checked) {
        row.classList.add("completed");
      }

      row.innerHTML = `
        <div class="hevy-set-chip tabular-nums">${setIndex + 1}</div>
        <div class="hevy-col-prev tabular-nums">${previousLabelText}</div>
        <input
          type="text"
          inputmode="decimal"
          class="hevy-cell-input input-kg tabular-nums"
          placeholder="${exLoads.previous || "0"}"
          value="${escapeHTML(currentLoad)}"
          aria-label="Carga em kg da série ${setIndex + 1}"
        />
        <input
          type="text"
          inputmode="numeric"
          class="hevy-cell-input input-reps tabular-nums"
          placeholder="${defaultRepsNum}"
          value="${escapeHTML(currentReps)}"
          aria-label="Repetições da série ${setIndex + 1}"
        />
        <button
          type="button"
          class="hevy-check-btn"
          aria-label="Concluir série ${setIndex + 1}"
        >
          ${checked ? "✓" : ""}
        </button>
      `;

      const kgInput = row.querySelector(".input-kg");
      const repsInput = row.querySelector(".input-reps");
      const checkBtn = row.querySelector(".hevy-check-btn");

      // Atualização de Carga em tempo real
      kgInput.addEventListener("input", (e) => {
        updateSetLoad(state.selectedDay, exerciseIndex, setIndex, e.target.value);
      });

      // Propagação inteligente para séries vazias se preencher a 1ª
      kgInput.addEventListener("change", (e) => {
        const val = e.target.value.trim();
        if (val && setIndex === 0) {
          const allKgInputs = card.querySelectorAll(".input-kg");
          allKgInputs.forEach((otherInput, otherIdx) => {
            if (otherIdx > 0 && !otherInput.value.trim()) {
              otherInput.value = val;
              updateSetLoad(state.selectedDay, exerciseIndex, otherIdx, val);
            }
          });
        }
      });

      // Atualização de Reps
      repsInput.addEventListener("input", (e) => {
        updateSetReps(state.selectedDay, exerciseIndex, setIndex, e.target.value);
      });

      // Clique no Checkmark
      checkBtn.addEventListener("click", () => {
        const willComplete = !isSetCompleted(state.selectedDay, exerciseIndex, setIndex);
        updateSet(state.selectedDay, exerciseIndex, setIndex, willComplete);

        if (willComplete) {
          row.classList.add("completed");
          checkBtn.textContent = "✓";
          vibrateDevice();

          if (exercise.rest > 0) {
            prepareTimer(exercise);
            startTimer(true);
            showToast(`Série ${setIndex + 1} concluída. Descanso de ${formatRest(exercise.rest)}!`);
          } else {
            showToast(`Série ${setIndex + 1} concluída!`);
          }
        } else {
          row.classList.remove("completed");
          checkBtn.textContent = "";
          showToast(`Série ${setIndex + 1} desmarcada.`);
        }

        renderHeader();
      });

      setRowsContainer.appendChild(row);
    }

    // Clique no Pill de Cadência
    const cadencePill = card.querySelector(".cadence-clickable-pill");
    if (cadencePill) {
      cadencePill.addEventListener("click", (e) => {
        e.stopPropagation();
        openCadenceModal(exercise);
      });
    }

    // Clique no Título do Exercício (Abre Treinador de Execução Animado)
    const exerciseTitle = card.querySelector(".exercise-clickable-title");
    if (exerciseTitle) {
      exerciseTitle.addEventListener("click", (e) => {
        e.stopPropagation();
        openExecutionModal(exercise);
      });
    }

    elements.workoutList.appendChild(card);
  });
}

/* =========================================================
   TEMPORIZADOR HEVY (REST-TIMER PILL & CIRCULAR PROGRESS)
   ========================================================= */

const MAIN_RING_CIRCUMFERENCE = 69.115; // 2 * PI * 11
const MINI_RING_CIRCUMFERENCE = 56.548; // 2 * PI * 9

function renderTimer() {
  const timer = state.timer;

  if (!timer.duration) {
    if (elements.timerCard) elements.timerCard.classList.add("hidden");
    syncMiniTimer();
    return;
  }

  if (elements.timerCard) {
    elements.timerCard.classList.remove("hidden");
  }

  if (elements.timerExercise) {
    elements.timerExercise.textContent = timer.exerciseName || "Descanso";
  }

  if (elements.timerDisplay) {
    elements.timerDisplay.textContent = formatTime(timer.remaining);
  }

  // Anel Circular do Timer Principal
  if (elements.mainTimerRingProgress) {
    const fraction = timer.duration ? Math.max(0, Math.min(1, 1 - (timer.remaining / timer.duration))) : 0;
    const offset = MAIN_RING_CIRCUMFERENCE * (1 - fraction);
    elements.mainTimerRingProgress.style.strokeDashoffset = String(offset);
  }

  // Botões de Pausar / Retomar
  if (elements.pauseTimerButton && elements.resumeTimerButton) {
    if (timer.status === "paused") {
      elements.pauseTimerButton.classList.add("hidden");
      elements.resumeTimerButton.classList.remove("hidden");
    } else {
      elements.pauseTimerButton.classList.remove("hidden");
      elements.resumeTimerButton.classList.add("hidden");
    }
  }

  syncMiniTimer();
}

function syncMiniTimer() {
  if (!elements.stickyMiniTimer) return;

  const timer = state.timer;
  const isTimerActive = Boolean(timer && timer.duration && (timer.status === "running" || timer.status === "paused"));

  if (isTimerActive && !isTimerCardVisible) {
    elements.stickyMiniTimer.classList.remove("hidden");
  } else {
    elements.stickyMiniTimer.classList.add("hidden");
  }

  if (elements.miniTimerDisplay) {
    elements.miniTimerDisplay.textContent = formatTime(timer.remaining || 0);
  }

  if (elements.miniTimerRingProgress) {
    const fraction = timer.duration ? Math.max(0, Math.min(1, 1 - (timer.remaining / timer.duration))) : 0;
    const offset = MINI_RING_CIRCUMFERENCE * (1 - fraction);
    elements.miniTimerRingProgress.style.strokeDashoffset = String(offset);
  }

  if (elements.miniTimerToggleIcon) {
    elements.miniTimerToggleIcon.textContent = timer.status === "running" ? "⏸" : "▶";
  }
}

function checkTimerCardVisibility() {
  if (!elements.timerCard || elements.timerCard.classList.contains("hidden")) {
    return false;
  }
  const rect = elements.timerCard.getBoundingClientRect();
  return rect.bottom > 60 && rect.top < (window.innerHeight - 60);
}

function initTimerObserver() {
  if (!elements.timerCard) return;

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isTimerCardVisible = entry.isIntersecting;
          syncMiniTimer();
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(elements.timerCard);
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!("IntersectionObserver" in window)) {
        isTimerCardVisible = checkTimerCardVisibility();
      }
      syncMiniTimer();
    },
    { passive: true }
  );
}

function prepareTimer(exercise) {
  state.timer = {
    status: "idle",
    duration: exercise.rest,
    remaining: exercise.rest,
    endAt: null,
    exerciseName: exercise.name
  };

  saveState();
  renderTimer();
}

function startTimer(autoStarted = false) {
  if (!state.timer.duration) return;

  unlockAudio();

  if (state.timer.status === "finished") {
    state.timer.remaining = state.timer.duration;
  }

  state.timer.status = "running";
  state.timer.endAt = Date.now() + state.timer.remaining * 1000;

  saveState();
  startTimerLoop();
  renderTimer();

  announce("Descanso iniciado.");
  if (!autoStarted) {
    showToast("Descanso iniciado.");
  }
}

function pauseTimer() {
  if (state.timer.status !== "running") return;

  updateTimer();
  state.timer.status = "paused";
  state.timer.endAt = null;

  stopTimerLoop();
  saveState();
  renderTimer();
  showToast("Descanso pausado.");
}

function resumeTimer() {
  if (state.timer.status !== "paused") return;

  unlockAudio();
  state.timer.status = "running";
  state.timer.endAt = Date.now() + state.timer.remaining * 1000;

  saveState();
  startTimerLoop();
  renderTimer();
  showToast("Descanso retomado.");
}

function adjustTimer(deltaSeconds) {
  if (!state.timer.duration) return;
  state.timer.remaining = Math.max(0, state.timer.remaining + deltaSeconds);
  if (state.timer.remaining > state.timer.duration) {
    state.timer.duration = state.timer.remaining;
  }
  if (state.timer.status === "running") {
    state.timer.endAt = Date.now() + state.timer.remaining * 1000;
  }
  saveState();
  renderTimer();
  showToast(`${deltaSeconds > 0 ? "+" : ""}${deltaSeconds}s no descanso.`);
}

function skipTimer() {
  if (!state.timer.duration) return;
  state.timer.status = "finished";
  state.timer.remaining = 0;
  state.timer.endAt = null;

  stopTimerLoop();
  saveState();
  finishTimer();
  showToast("Descanso pulado.");
}

function updateTimer() {
  if (state.timer.status !== "running") {
    renderTimer();
    return;
  }

  const remaining = Math.max(0, (state.timer.endAt - Date.now()) / 1000);
  state.timer.remaining = remaining;

  if (remaining <= 0) {
    state.timer.status = "finished";
    state.timer.remaining = 0;
    state.timer.endAt = null;

    stopTimerLoop();
    saveState();
    finishTimer();
    return;
  }

  saveState();
  renderTimer();
}

function startTimerLoop() {
  stopTimerLoop();
  timerInterval = window.setInterval(updateTimer, 250);
  updateTimer();
}

function stopTimerLoop() {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval);
    timerInterval = null;
  }
}

function finishTimer() {
  renderTimer();
  playAlertSound();
  vibrateDevice();
  notifyRestFinished();

  announce("Descanso finalizado. Próxima série!");
  showToast("Descanso finalizado!");
}

/* =========================================================
   ÁUDIO, VIBRAÇÃO & NOTIFICAÇÕES
   ========================================================= */

function unlockAudio() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!audioContext) {
      audioContext = new AudioCtx();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
  } catch (error) {
    console.warn("Áudio não disponível:", error);
  }
}

function playAlertSound() {
  try {
    if (!audioContext) unlockAudio();
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, audioContext.currentTime); // Hevy alert chime A5

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.35);
  } catch (err) {
    console.warn("Não foi possível tocar som:", err);
  }
}

function vibrateDevice() {
  if (state.vibration && "vibrate" in navigator) {
    navigator.vibrate([120, 60, 120]);
  }
}

async function notifyRestFinished() {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("Descanso Finalizado! 🔥", {
        body: "Hora da próxima série.",
        tag: "hevy-rest-timer",
        renotify: true
      });
    } else {
      new Notification("Descanso Finalizado! 🔥", {
        body: "Hora da próxima série."
      });
    }
  } catch (err) {
    console.warn("Falha ao exibir notificação:", err);
  }
}

async function requestNotifications() {
  if (!("Notification" in window)) {
    showToast("Este navegador não suporta notificações.");
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      showToast("Notificações ativadas com sucesso!");
    } else {
      showToast("Notificações não foram permitidas.");
    }
  } catch (err) {
    showToast("Erro ao solicitar notificações.");
  }
}

/* =========================================================
   FINALIZAR TREINO & RESUMO DA SESSÃO
   ========================================================= */

function openWorkoutSummary() {
  const workout = getWorkout();
  const progress = getProgress();
  const { totalVolume, prCount } = calculateWorkoutVolume();

  if (elements.summaryRoutineName) {
    elements.summaryRoutineName.textContent = workout.title;
  }
  if (elements.summaryDuration) {
    elements.summaryDuration.textContent = formatDuration(state.workoutSeconds);
  }
  if (elements.summaryVolume) {
    elements.summaryVolume.textContent = `${totalVolume.toLocaleString("pt-BR")} kg`;
  }
  if (elements.summarySets) {
    elements.summarySets.textContent = `${progress.completedSets} de ${progress.totalSets}`;
  }
  if (elements.summaryPrCount) {
    elements.summaryPrCount.textContent = `${prCount} ${prCount === 1 ? "recorde" : "recordes"}`;
  }

  if (elements.workoutSummaryModal) {
    elements.workoutSummaryModal.classList.remove("hidden");
  }
}

function closeWorkoutSummary() {
  if (elements.workoutSummaryModal) {
    elements.workoutSummaryModal.classList.add("hidden");
  }
  showToast("Treino registrado! Bom descanso 💪");
}

/* =========================================================
   GUIA DIDÁTICO DE CADÊNCIAS & MÉTODOS DE TREINO
   ========================================================= */

const CADENCE_EXPLANATIONS = {
  "3-1-1-0": {
    digits: [3, 1, 1, 0],
    summary: "Ritmo de força hipertrófica clássica com descida bem controlada e pausa anti-rebote.",
    steps: [
      { badge: "3s Excêntrica", text: "Desça a carga controlando lentamente em 3 segundos, resistindo à gravidade e alongando a musculatura." },
      { badge: "1s Pausa Baixa", text: "Segure 1 segundo no ponto de máximo alongamento para dissipar a energia elástica do tendão." },
      { badge: "1s Concêntrica", text: "Suba com força explosiva e deliberada em 1 segundo mantendo a postura perfeita." },
      { badge: "0s Pausa Alta", text: "Sem descanso no topo (0s) — inicie imediatamente a próxima repetição para tensão contínua." }
    ]
  },
  "3-0-1-1": {
    digits: [3, 0, 1, 1],
    summary: "Descida controlada, inversão imediata de direção e pico de contração no ponto alto.",
    steps: [
      { badge: "3s Excêntrica", text: "Desça o peso suavemente em 3 segundos sentindo as fibras musculares sob carga." },
      { badge: "0s Sem Pausa", text: "Inverta o movimento imediatamente no ponto baixo sem descansar nem bater nos pinos." },
      { badge: "1s Concêntrica", text: "Puxe ou empurre com potência em 1 segundo até o topo." },
      { badge: "1s Pico Contração", text: "Congele por 1 segundo inteiro no ponto de máxima contração, espremendo o músculo com força." }
    ]
  },
  "2-0-2-1": {
    digits: [2, 0, 2, 1],
    summary: "Cadência cadenciada de isolamento contínuo com contração espremida no final.",
    steps: [
      { badge: "2s Excêntrica", text: "Abra/retorne os cabos ou peso em 2 segundos mantendo estabilidade articular." },
      { badge: "0s Sem Pausa", text: "Não relaxe no ponto aberto; inicie o retorno sem perder a tensão dos cabos." },
      { badge: "2s Concêntrica", text: "Junte a carga em 2 segundos contínuos e sem impulso do tronco." },
      { badge: "1s Pico Contração", text: "Segure 1 segundo no centro espremendo o peitoral com intensidade máxima." }
    ]
  },
  "2-1-2-1": {
    digits: [2, 1, 2, 1],
    summary: "Controle total com parada estirada e contração forçada em ambos os polos do movimento.",
    steps: [
      { badge: "2s Excêntrica", text: "Abra/desça a carga controladamente em 2 segundos." },
      { badge: "1s Pausa Alongada", text: "Segure 1 segundo no ponto de estiramento máximo sentindo o músculo abrir." },
      { badge: "2s Concêntrica", text: "Feche ou suba em 2 segundos com velocidade uniforme." },
      { badge: "1s Pico Contração", text: "Aperte a musculatura por 1 segundo no ponto de encurtamento máximo." }
    ]
  },
  "3-0-1-0": {
    digits: [3, 0, 1, 0],
    summary: "Padrão ouro para movimentos compostos: descida de 3s e subida explosiva de 1s.",
    steps: [
      { badge: "3s Excêntrica", text: "Desça a barra ou halteres em 3 segundos mantendo as escápulas e tronco firmes." },
      { badge: "0s Sem Pausa", text: "Ao atingir a amplitude ideal, inicie a subida sem pausa no ponto baixo." },
      { badge: "1s Concêntrica", text: "Empurre com explosão máxima em 1 segundo acelerando contra a resistência." },
      { badge: "0s Pausa Alta", text: "Não trave as articulações no topo; emende a descida da repetição seguinte." }
    ]
  },
  "2-0-2-0": {
    digits: [2, 0, 2, 0],
    summary: "Movimento pendular contínuo de 4 segundos por repetição focado em pump e queimação.",
    steps: [
      { badge: "2s Excêntrica", text: "Desça os halteres em 2 segundos sem deixar o peso cair pela gravidade." },
      { badge: "0s Sem Pausa", text: "Não encoste os pesos no corpo; inverta o movimento antes de perder a tensão." },
      { badge: "2s Concêntrica", text: "Eleve os braços em 2 segundos suaves focando apenas no deltoide lateral." },
      { badge: "0s Sem Pausa", text: "Sem pausa no topo, retorne imediatamente mantendo o músculo queimando." }
    ]
  },
  "2-1-1-0": {
    digits: [2, 1, 1, 0],
    summary: "Alongamento pronunciado para grupos musculares de alavanca longa (tríceps, panturrilhas).",
    steps: [
      { badge: "2s Excêntrica", text: "Desça o peso atrás da cabeça ou corpo em 2 segundos." },
      { badge: "1s Pausa Alongada", text: "Congele 1 segundo na posição mais alongada para focar na cabeça longa." },
      { badge: "1s Concêntrica", text: "Estenda o braço com força em 1 segundo." },
      { badge: "0s Pausa Alta", text: "Inicie a próxima flexão sem descanso articular." }
    ]
  },
  "2-0-1-2": {
    digits: [2, 0, 1, 2],
    summary: "Enfatiza 2 segundos inteiros de isometria no ponto de contração máxima.",
    steps: [
      { badge: "2s Excêntrica", text: "Retorne o peso em 2 segundos mantendo os cotovelos ou quadril estáveis." },
      { badge: "0s Sem Pausa", text: "Inverta a direção imediatamente no retorno." },
      { badge: "1s Concêntrica", text: "Pressione ou eleve a carga rapidamente em 1 segundo." },
      { badge: "2s Pico Contração", text: "Segure a posição final por 2 segundos cravados no relógio, espremendo no limite da força." }
    ]
  },
  "2-0-1-1": {
    digits: [2, 0, 1, 1],
    summary: "Cadência ágil e firme para puxadas, braços e posteriores com contração de 1s.",
    steps: [
      { badge: "2s Excêntrica", text: "Retorne a carga em 2 segundos sob controle das costas/braços." },
      { badge: "0s Sem Pausa", text: "Sem pausa na extensão, inicie a puxada com o músculo-alvo." },
      { badge: "1s Concêntrica", text: "Puxe ou flexione em 1 segundo forte aproximando a carga do corpo." },
      { badge: "1s Pico Contração", text: "Trave 1 segundo esmagando a contração das escápulas ou bíceps." }
    ]
  },
  "2-0-1-0": {
    digits: [2, 0, 1, 0],
    summary: "Ritmo rápido e dinâmico mantendo o músculo sempre ativo e acelerando o ritmo metabólico.",
    steps: [
      { badge: "2s Excêntrica", text: "Desça em 2 segundos controlando a carga sem soltar." },
      { badge: "0s Sem Pausa", text: "Sem pausa embaixo, inicie a subida." },
      { badge: "1s Concêntrica", text: "Suba em 1 segundo firme com potência." },
      { badge: "0s Pausa Alta", text: "Sem descanso no topo, transicione direto para a descida." }
    ]
  },
  "3-1-1-1": {
    digits: [3, 1, 1, 1],
    summary: "Cadência de alto recrutamento: descida de 3s, pausa em baixo e contração no topo.",
    steps: [
      { badge: "3s Excêntrica", text: "Desça em 3 segundos lentos sentindo a musculatura trabalhar na fase negativa." },
      { badge: "1s Pausa Alongada", text: "Pare 1 segundo no ponto de máximo estiramento sem balanço." },
      { badge: "1s Concêntrica", text: "Contraia com força máxima subindo em 1 segundo." },
      { badge: "1s Pico Contração", text: "Mantenha 1 segundo de isometria pesada antes de iniciar a descida." }
    ]
  },
  "2-2-1-1": {
    digits: [2, 2, 1, 1],
    summary: "Especial para panturrilhas: 2s segurando o calcanhar no fundo para anular o tendão elástico.",
    steps: [
      { badge: "2s Excêntrica", text: "Desça os calcanhares abaixo da linha do degrau em 2 segundos." },
      { badge: "2s Pausa Alongada", text: "Segure 2 segundos inteiros no fundo. Isso elimina o reflexo miotático do tendão de Aquiles e força a panturrilha pura a trabalhar." },
      { badge: "1s Concêntrica", text: "Suba na ponta dos pés em 1 segundo com toda a força." },
      { badge: "1s Pico Contração", text: "Aperte no ponto mais alto por 1 segundo antes de descer." }
    ]
  },
  "2-1-1-1": {
    digits: [2, 1, 1, 1],
    summary: "Pausa de 1 segundo embaixo e 1 segundo no topo para estabilidade perfeita.",
    steps: [
      { badge: "2s Excêntrica", text: "Desça em 2 segundos com velocidade controlada." },
      { badge: "1s Pausa Alongada", text: "Pare 1 segundo no ponto mais fundo para anular rebotes e embalos." },
      { badge: "1s Concêntrica", text: "Suba em 1 segundo de contração pura." },
      { badge: "1s Pico Contração", text: "Esprema a musculatura por 1 segundo no topo antes de descer." }
    ]
  },
  "4-0-1-0": {
    digits: [4, 0, 1, 0],
    summary: "Sobrecarga excêntrica pesada: 4 segundos descendo gerando microlesões controladas nas fibras.",
    steps: [
      { badge: "4s Excêntrica Lenta", text: "Desça a plataforma ou o rolo do abdômen em 4 segundos muito lentos e focados. Essa é a fase que mais estimula hipertrofia." },
      { badge: "0s Sem Pausa", text: "Chegando na profundidade segura, inverta imediatamente sem parar no fundo." },
      { badge: "1s Concêntrica Forte", text: "Empurre a plataforma ou recolha o corpo em 1 segundo com máxima potência." },
      { badge: "0s Pausa no Topo", text: "Não trave os joelhos ou cotovelos no topo; comece a descida de 4s imediatamente." }
    ]
  },
  "4-1-1-0": {
    digits: [4, 1, 1, 0],
    summary: "Descida ultracontrolada de 4s com pausa de 1s no estiramento máximo dos posteriores de coxa.",
    steps: [
      { badge: "4s Excêntrica Lenta", text: "Empurre o quadril para trás e desça a barra/halteres em 4 segundos controlados até sentir o posterior alongar ao máximo." },
      { badge: "1s Pausa Alongada", text: "Congele 1 segundo no ponto mais fundo mantendo as costas travadas." },
      { badge: "1s Concêntrica", text: "Empurre o chão com os calcanhares e suba em 1 segundo contraindo os glúteos." },
      { badge: "0s Pausa no Topo", text: "Sem descansar em pé; reinicie a descida para manter o posterior sob tensão." }
    ]
  },
  "Isometria": {
    digits: null,
    summary: "Tensão muscular estática sem movimento articular de subida ou descida.",
    steps: [
      { badge: "Posição Travada", text: "Assuma a postura correta do exercício (ex: prancha com abdômen e glúteos travados)." },
      { badge: "Tensão Máxima", text: "Contraia ativamente toda a cadeia muscular contra a gravidade sem deixar a postura ceder." },
      { badge: "Respiração Controlada", text: "Mantenha respiração curta e diafragmática, sem prender o ar em apneia prolongada." },
      { badge: "Falha Muscular", text: "Sustente a posição estática até o esgotamento completo das fibras musculares." }
    ]
  }
};

const TRAINING_METHODS = [
  {
    name: "Drop Set",
    tag: "Falha + Carga Reduzida",
    desc: "Na última série, vá até a falha. Reduza o peso em 20% e faça até a falha de novo, sem descansar."
  },
  {
    name: "Drop Set Duplo",
    tag: "3 Falhas Consecutivas",
    desc: "Na última série, falhe absoluta. Tire 20%, falhe de novo. Tire mais 20% e falhe pela terceira vez sem descanso."
  },
  {
    name: "Rest-Pause",
    tag: "Pausa Curta de 10-15s",
    desc: "Na última série, vá até a falha, descanse 10 a 15 segundos na máquina ou banco, respire fundo e faça mais repetições extras até travar."
  },
  {
    name: "Myo-Reps",
    tag: "Ativação + Mini-Séries",
    desc: "Faça uma série de ativação pesada até perto da falha. Respire fundo 5 vezes e faça mini-séries de 3 a 5 reps. Repita até travar de vez."
  },
  {
    name: "Pirâmide Crescente",
    tag: "Carga Sobe, Reps Descem",
    desc: "Aumente o peso dos halteres ou da barra a cada série sucessiva, diminuindo gradualmente o número de repetições."
  },
  {
    name: "Top Set + Back-off",
    tag: "Série Pesada + Volume",
    desc: "Faça a primeira série pesada até quase falhar (Top Set). Reduza a carga em 20% para as séries seguintes acumulando volume com alta qualidade."
  },
  {
    name: "Cluster Set",
    tag: "Pausa Intra-Série",
    desc: "Na última série, vá até perto da falha, descanse 15 segundos no equipamento e faça mais 3 a 5 repetições com a mesma carga."
  },
  {
    name: "Pico de Contração",
    tag: "Isometria no Ápice",
    desc: "Segure a carga no ponto máximo de contração por 1 a 2 segundos inteiros espremendo o músculo antes de retornar."
  },
  {
    name: "Pausa no Alongamento",
    tag: "Elimina Rebote Elástico",
    desc: "Desça no ponto máximo de estiramento e segure alongando por 2 segundos inteiros para anular o rebote antes de subir."
  },
  {
    name: "Falha Isométrica",
    tag: "Tensão Estática Limite",
    desc: "Mantenha a posição travada sob esforço máximo constante até não conseguir suportar mais a carga."
  }
];

function openCadenceModal(exercise) {
  if (!elements.cadenceModal) return;

  const cadenceKey = exercise.cadence || "3-0-1-0";
  const cadenceInfo = CADENCE_EXPLANATIONS[cadenceKey] || CADENCE_EXPLANATIONS["3-0-1-0"];

  if (elements.cadenceModalBadge) {
    elements.cadenceModalBadge.textContent = `⏱️ CADÊNCIA ${cadenceKey}`;
  }
  if (elements.cadenceModalTitle) {
    elements.cadenceModalTitle.textContent = `Cadência: ${cadenceKey}`;
  }
  if (elements.cadenceModalSubtitle) {
    elements.cadenceModalSubtitle.textContent = `Exercício: ${exercise.name}`;
  }

  // Formula Header com os 4 chips didáticos
  if (elements.cadenceFormulaHeader) {
    if (cadenceInfo.digits) {
      const [d1, d2, d3, d4] = cadenceInfo.digits;
      elements.cadenceFormulaHeader.innerHTML = `
        <div class="cadence-formula-grid">
          <div class="cadence-formula-col">
            <span class="cadence-digit-num color-eccentric tabular-nums">${d1}s</span>
            <span class="cadence-digit-label">Descida</span>
            <span class="cadence-digit-sub">Excêntrica</span>
          </div>
          <div class="cadence-formula-col">
            <span class="cadence-digit-num color-pause tabular-nums">${d2}s</span>
            <span class="cadence-digit-label">Pausa</span>
            <span class="cadence-digit-sub">Alongamento</span>
          </div>
          <div class="cadence-formula-col">
            <span class="cadence-digit-num color-concentric tabular-nums">${d3}s</span>
            <span class="cadence-digit-label">Subida</span>
            <span class="cadence-digit-sub">Concêntrica</span>
          </div>
          <div class="cadence-formula-col">
            <span class="cadence-digit-num color-pause tabular-nums">${d4}s</span>
            <span class="cadence-digit-label">Pausa</span>
            <span class="cadence-digit-sub">Contração</span>
          </div>
        </div>
      `;
    } else {
      elements.cadenceFormulaHeader.innerHTML = `
        <div class="cadence-formula-col" style="grid-column: span 4; padding: 14px;">
          <span class="cadence-digit-num color-pause">ISOMETRIA</span>
          <span class="cadence-digit-label">Tensão Estática Contínua</span>
          <span class="cadence-digit-sub">Sustente a postura travada até a falha muscular</span>
        </div>
      `;
    }
  }

  // Breakdown Card
  if (elements.cadenceBreakdownCard) {
    const stepsHTML = cadenceInfo.steps.map((step, idx) => {
      const badgeClasses = ["eccentric", "stretch", "concentric", "peak"];
      const badgeClass = badgeClasses[idx] || "eccentric";
      return `
        <div class="cadence-step-row">
          <span class="cadence-step-badge ${badgeClass}">${escapeHTML(step.badge)}</span>
          <span class="cadence-step-content">${escapeHTML(step.text)}</span>
        </div>
      `;
    }).join("");

    elements.cadenceBreakdownCard.innerHTML = `
      <div class="cadence-breakdown-title">
        <span>📖 O QUE SIGNIFICA ESTE RITMO</span>
      </div>
      <p class="cadence-summary-text">${escapeHTML(cadenceInfo.summary)}</p>
      <div class="cadence-steps-list">
        ${stepsHTML}
      </div>
    `;
  }

  // Training Methods List
  if (elements.trainingMethodsList) {
    elements.trainingMethodsList.innerHTML = TRAINING_METHODS.map((method) => `
      <div class="method-card">
        <div class="method-card-header">
          <span class="method-name">${escapeHTML(method.name)}</span>
          <span class="method-tag">${escapeHTML(method.tag)}</span>
        </div>
        <p class="method-desc">${escapeHTML(method.desc)}</p>
      </div>
    `).join("");
  }

  elements.cadenceModal.classList.remove("hidden");
}

function closeCadenceModal() {
  if (elements.cadenceModal) {
    elements.cadenceModal.classList.add("hidden");
  }
}

/* =========================================================
   TREINADOR DE EXECUÇÃO & CADÊNCIA (CADENCE COACH)
   ========================================================= */

const CadenceCoach = {
  exercise: null,
  active: false,
  paused: false,
  sound: true,
  currentRep: 0,
  targetReps: 10,
  phaseIndex: 0,
  phaseTimeElapsed: 0,
  animationFrameId: null,
  lastTimestamp: null,

  phases: [],

  init() {
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.addEventListener("click", () => {
        if (!this.active) {
          this.start();
        } else if (this.paused) {
          this.resume();
        } else {
          this.pause();
        }
      });
    }

    if (elements.coachResetBtn) {
      elements.coachResetBtn.addEventListener("click", () => {
        this.reset();
      });
    }

    if (elements.coachSoundToggle) {
      elements.coachSoundToggle.addEventListener("click", () => {
        this.sound = !this.sound;
        if (elements.coachSoundIcon) {
          elements.coachSoundIcon.textContent = this.sound ? "🔊" : "🔇";
        }
      });
    }
  },

  setup(exercise) {
    this.stop();
    this.exercise = exercise;
    this.currentRep = 0;
    this.targetReps = parseRepsNumber(exercise.reps) || 10;
    this.phaseIndex = 0;
    this.phaseTimeElapsed = 0;
    this.paused = false;

    const cadenceKey = exercise.cadence || "3-0-1-0";
    const info = CADENCE_EXPLANATIONS[cadenceKey] || CADENCE_EXPLANATIONS["3-0-1-0"];

    if (info.digits) {
      const [d1, d2, d3, d4] = info.digits;
      this.phases = [
        { key: "eccentric", duration: Math.max(d1, 0.5), label: "DESCIDA (EXCÊNTRICA)", icon: "⬇️", colorClass: "phase-eccentric", yStart: 0, yEnd: 65, cueText: `${d1}s controlando a descida` },
        { key: "stretch", duration: Math.max(d2, 0.1), label: "PAUSA ALONGAMENTO", icon: "⏸️", colorClass: "phase-stretch", yStart: 65, yEnd: 65, cueText: `${d2}s segurando no ponto mais fundo` },
        { key: "concentric", duration: Math.max(d3, 0.5), label: "SUBIDA (CONCÊNTRICA)", icon: "⬆️", colorClass: "phase-concentric", yStart: 65, yEnd: 0, cueText: `${d3}s empurrando/puxando com força` },
        { key: "peak", duration: Math.max(d4, 0.1), label: "PICO DE CONTRAÇÃO", icon: "⏸️", colorClass: "phase-peak", yStart: 0, yEnd: 0, cueText: `${d4}s sem descanso no topo` }
      ];
    } else {
      this.phases = [
        { key: "isometric", duration: 30, label: "ISOMETRIA ATIVA", icon: "⚡", colorClass: "phase-stretch", yStart: 30, yEnd: 30, cueText: "Sustente a contração estática máxima" }
      ];
    }

    this.updateStaticUI();
    this.resetStageVisuals();
  },

  updateStaticUI() {
    if (!this.exercise) return;
    if (elements.execCadenceBadge) {
      elements.execCadenceBadge.textContent = this.exercise.cadence || "3-0-1-0";
    }
    if (elements.execRirBadge) {
      elements.execRirBadge.textContent = `RIR ${this.exercise.rir !== undefined ? this.exercise.rir : 1}`;
    }
    if (elements.executionModalTitle) {
      elements.executionModalTitle.textContent = this.exercise.name;
    }
    if (elements.executionModalSubtitle) {
      elements.executionModalSubtitle.textContent = `${this.exercise.sets} séries · ${this.exercise.reps} reps · descanso ${formatRest(this.exercise.rest)}`;
    }
    if (elements.coachCadenceFormula) {
      elements.coachCadenceFormula.textContent = this.exercise.cadence || "3-0-1-0";
    }
    if (elements.coachRepCounter) {
      elements.coachRepCounter.textContent = `0 / ${this.targetReps}`;
    }
    if (elements.coachTechniqueText) {
      elements.coachTechniqueText.textContent = this.exercise.tip || this.exercise.technique;
    }

    if (elements.cueEccentric && this.phases[0]) elements.cueEccentric.textContent = this.phases[0].cueText;
    if (elements.cueStretch && this.phases[1]) elements.cueStretch.textContent = this.phases[1].cueText;
    if (elements.cueConcentric && this.phases[2]) elements.cueConcentric.textContent = this.phases[2].cueText;
    if (elements.cuePeak && this.phases[3]) elements.cuePeak.textContent = this.phases[3].cueText;

    if (elements.coachStartIcon) elements.coachStartIcon.textContent = "▶";
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>▶</span> Iniciar Execução`;
    }
  },

  resetStageVisuals() {
    if (elements.coachMovingWeight) {
      elements.coachMovingWeight.setAttribute("transform", "translate(0, 0)");
    }
    const armL = $("#armLeft");
    const armR = $("#armRight");
    if (armL) armL.setAttribute("y2", "70");
    if (armR) armR.setAttribute("y2", "70");

    if (elements.coachPhasePill) {
      elements.coachPhasePill.className = "phase-indicator-pill phase-eccentric";
    }
    if (elements.coachPhaseIcon) elements.coachPhaseIcon.textContent = "⬇️";
    if (elements.coachPhaseLabel) elements.coachPhaseLabel.textContent = "PRONTO";
    if (elements.coachPhaseTimer) elements.coachPhaseTimer.textContent = "0s";
    if (elements.coachPhaseProgressBar) elements.coachPhaseProgressBar.style.width = "0%";
  },

  start() {
    this.active = true;
    this.paused = false;
    this.currentRep = 1;
    this.phaseIndex = 0;
    this.phaseTimeElapsed = 0;
    this.lastTimestamp = performance.now();

    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>⏸</span> Pausar`;
    }

    this.onPhaseEnter();
    this.loop();
  },

  pause() {
    this.paused = true;
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>▶</span> Retomar`;
    }
    if (elements.coachPhaseLabel) {
      elements.coachPhaseLabel.textContent = "PAUSADO";
    }
  },

  resume() {
    this.paused = false;
    this.lastTimestamp = performance.now();
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>⏸</span> Pausar`;
    }
    this.loop();
  },

  reset() {
    this.stop();
    this.currentRep = 0;
    this.phaseIndex = 0;
    this.phaseTimeElapsed = 0;
    this.resetStageVisuals();
    if (elements.coachRepCounter) {
      elements.coachRepCounter.textContent = `0 / ${this.targetReps}`;
    }
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>▶</span> Iniciar Execução`;
    }
  },

  stop() {
    this.active = false;
    this.paused = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  },

  onPhaseEnter() {
    const phase = this.phases[this.phaseIndex];
    if (!phase) return;

    if (elements.coachPhasePill) {
      elements.coachPhasePill.className = `phase-indicator-pill ${phase.colorClass}`;
    }
    if (elements.coachPhaseIcon) elements.coachPhaseIcon.textContent = phase.icon;
    if (elements.coachPhaseLabel) elements.coachPhaseLabel.textContent = phase.label;

    if (elements.coachRepCounter) {
      elements.coachRepCounter.textContent = `${this.currentRep} / ${this.targetReps}`;
    }

    if (this.sound) {
      if (phase.key === "eccentric") playBeep(360, 0.08);
      else if (phase.key === "concentric") playBeep(520, 0.1);
      else if (phase.key === "stretch") playBeep(440, 0.06);
      else if (phase.key === "peak") playBeep(440, 0.06);
    }
  },

  loop() {
    if (!this.active || this.paused) return;

    const now = performance.now();
    const delta = (now - this.lastTimestamp) / 1000;
    this.lastTimestamp = now;

    const currentPhase = this.phases[this.phaseIndex];
    if (currentPhase) {
      this.phaseTimeElapsed += delta;
      const timeLeft = Math.max(0, currentPhase.duration - this.phaseTimeElapsed);
      const progress = Math.min(1, this.phaseTimeElapsed / currentPhase.duration);

      if (elements.coachPhaseTimer) {
        elements.coachPhaseTimer.textContent = `${timeLeft.toFixed(1)}s`;
      }
      if (elements.coachPhaseProgressBar) {
        elements.coachPhaseProgressBar.style.width = `${(progress * 100).toFixed(1)}%`;
      }

      const currentY = currentPhase.yStart + (currentPhase.yEnd - currentPhase.yStart) * progress;
      if (elements.coachMovingWeight) {
        elements.coachMovingWeight.setAttribute("transform", `translate(0, ${currentY})`);
      }
      const armL = $("#armLeft");
      const armR = $("#armRight");
      if (armL) armL.setAttribute("y2", String(70 + currentY));
      if (armR) armR.setAttribute("y2", String(70 + currentY));

      if (this.phaseTimeElapsed >= currentPhase.duration) {
        this.phaseTimeElapsed = 0;
        this.phaseIndex += 1;

        if (this.phaseIndex >= this.phases.length) {
          this.phaseIndex = 0;
          this.currentRep += 1;

          if (this.sound) {
            playBeep(660, 0.15);
          }

          if (this.currentRep > this.targetReps) {
            this.finishSet();
            return;
          }
        }

        this.onPhaseEnter();
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  },

  finishSet() {
    this.stop();
    if (elements.coachPhaseLabel) elements.coachPhaseLabel.textContent = "SÉRIE CONCLUÍDA! 💪";
    if (elements.coachPhaseTimer) elements.coachPhaseTimer.textContent = "✓";
    if (elements.coachPhaseProgressBar) elements.coachPhaseProgressBar.style.width = "100%";
    if (elements.coachStartPauseBtn) {
      elements.coachStartPauseBtn.innerHTML = `<span>▶</span> Fazer Novamente`;
    }
    if (this.sound) {
      playBeep(784, 0.25);
    }
  }
};

function openExecutionModal(exercise) {
  if (!elements.executionModal) return;
  CadenceCoach.setup(exercise);
  elements.executionModal.classList.remove("hidden");
}

function closeExecutionModal() {
  if (elements.executionModal) {
    CadenceCoach.stop();
    elements.executionModal.classList.add("hidden");
  }
}

function resetDay() {
  const confirmed = window.confirm(`Redefinir o treino de ${DAY_LABELS[state.selectedDay]}?`);
  if (!confirmed) return;

  const workout = getWorkout(state.selectedDay);

  workout.exercises.forEach((exercise, exerciseIndex) => {
    const exKey = getExerciseKey(state.selectedDay, exerciseIndex);
    const totalSets = getExerciseTotalSets(state.selectedDay, exerciseIndex, exercise.sets);
    let latestLoad = (state.exerciseLoads && state.exerciseLoads[exKey]?.current) || "";

    for (let s = 0; s < totalSets; s += 1) {
      const setKey = getSetKey(state.selectedDay, exerciseIndex, s);
      const setLoad = state.loads && state.loads[setKey];
      if (setLoad) {
        latestLoad = setLoad;
      }
      delete state.completed[setKey];
    }

    if (latestLoad) {
      if (!state.exerciseLoads) state.exerciseLoads = {};
      state.exerciseLoads[exKey] = {
        previous: latestLoad,
        current: ""
      };
    }
  });

  delete state.notes[state.selectedDay];
  delete state.extraSets[state.selectedDay];
  state.workoutStartTime = null;
  state.workoutSeconds = 0;

  saveState();
  render();
  showToast("Treino redefinido. Cargas salvas como base anterior!");
}

/* =========================================================
   TEMA (DARK HEVY DEFAULT / LIGHT OPÇÃO)
   ========================================================= */

function toggleTheme() {
  const current = document.documentElement.dataset.theme || "dark";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem(THEME_KEY, next);
  if (elements.themeIcon) {
    elements.themeIcon.textContent = next === "dark" ? "☼" : "☾";
  }
}

function restoreTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "dark";
  document.documentElement.dataset.theme = saved;
  if (elements.themeIcon) {
    elements.themeIcon.textContent = saved === "dark" ? "☼" : "☾";
  }
}

/* =========================================================
   EVENTOS
   ========================================================= */

function setupEvents() {
  if (elements.themeToggle) {
    elements.themeToggle.addEventListener("click", toggleTheme);
  }

  if (elements.finishWorkoutBtn) {
    elements.finishWorkoutBtn.addEventListener("click", openWorkoutSummary);
  }

  if (elements.closeSummaryBtn) {
    elements.closeSummaryBtn.addEventListener("click", closeWorkoutSummary);
  }

  if (elements.modalScrim) {
    elements.modalScrim.addEventListener("click", closeWorkoutSummary);
  }

  // Cadence Modal Listeners
  if (elements.closeCadenceBtn) {
    elements.closeCadenceBtn.addEventListener("click", closeCadenceModal);
  }
  if (elements.cadenceModalScrim) {
    elements.cadenceModalScrim.addEventListener("click", closeCadenceModal);
  }

  // Execution Coach Modal Listeners
  if (elements.closeExecutionBtn) {
    elements.closeExecutionBtn.addEventListener("click", closeExecutionModal);
  }
  if (elements.executionModalScrim) {
    elements.executionModalScrim.addEventListener("click", closeExecutionModal);
  }

  CadenceCoach.init();

  if (elements.resetDayButton) {
    elements.resetDayButton.addEventListener("click", resetDay);
  }

  // Controles do Timer Principal
  if (elements.minus15TimerButton) {
    elements.minus15TimerButton.addEventListener("click", () => adjustTimer(-15));
  }
  if (elements.plus15TimerButton) {
    elements.plus15TimerButton.addEventListener("click", () => adjustTimer(15));
  }
  if (elements.pauseTimerButton) {
    elements.pauseTimerButton.addEventListener("click", pauseTimer);
  }
  if (elements.resumeTimerButton) {
    elements.resumeTimerButton.addEventListener("click", resumeTimer);
  }
  if (elements.skipTimerButton) {
    elements.skipTimerButton.addEventListener("click", skipTimer);
  }

  // Mini-Timer Controls
  if (elements.miniTimerJumpBtn) {
    elements.miniTimerJumpBtn.addEventListener("click", () => {
      elements.timerCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
  if (elements.miniTimerToggleBtn) {
    elements.miniTimerToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (state.timer.status === "running") {
        pauseTimer();
      } else if (state.timer.status === "paused") {
        resumeTimer();
      }
    });
  }
  if (elements.miniTimerSkipBtn) {
    elements.miniTimerSkipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      skipTimer();
    });
  }

  // Permissões e Vibração
  if (elements.notificationPermissionButton) {
    elements.notificationPermissionButton.addEventListener("click", requestNotifications);
  }
  if (elements.vibrationToggle) {
    elements.vibrationToggle.addEventListener("change", () => {
      state.vibration = elements.vibrationToggle.checked;
      saveState();
    });
  }

  // Anotações
  if (elements.dayNotes) {
    elements.dayNotes.addEventListener("input", () => {
      state.notes[state.selectedDay] = elements.dayNotes.value;
      saveState();
    });
  }

  // Visibilidade da página (background / retorno)
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      updateTimer();
      renderTimer();
    }
  });

  window.addEventListener("focus", () => {
    updateTimer();
    renderTimer();
  });

  window.addEventListener("beforeunload", saveState);

  // Abas de Navegação Hevy Inferiores (5 abas)
  const bottomTabs = document.querySelectorAll(".hevy-tab");
  bottomTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      bottomTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.getAttribute("data-target");
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}

function restoreTimer() {
  if (state.timer.status !== "running") {
    renderTimer();
    return;
  }
  if (!state.timer.endAt) {
    state.timer.status = "paused";
    saveState();
    renderTimer();
    return;
  }
  startTimerLoop();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./service-worker.js", { scope: "./" }).catch((err) => {
    console.warn("Service Worker não registrado:", err);
  });
}

function render() {
  renderTabs();
  renderHeader();
  renderStructureBar();
  renderWorkout();
  renderTimer();
}

/* =========================================================
   INICIALIZAÇÃO DO APP
   ========================================================= */

async function init() {
  restoreTheme();
  await loadWorkoutsData();
  loadState();
  setupEvents();
  render();
  restoreTimer();
  initTimerObserver();
  startDurationTimer();
  registerServiceWorker();
}

init();