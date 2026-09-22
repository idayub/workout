#!/usr/bin/env python3
"""
Converte docs/planejamento_arnold_split.md para planejamento.json
Garante fonte única da verdade para todos os exercícios, séries, repetições, cadências e técnicas.
"""
import json
import os
import re

def convert():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_path = os.path.join(base_dir, "docs", "planejamento_arnold_split.md")
    json_path = os.path.join(base_dir, "planejamento.json")

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    workouts = {
        "segunda": {"title": "Treino A: Peito, Ombros e Tríceps", "subtitle": "Início da semana com foco em empurrar, densidade peitoral e deltoides.", "exercises": []},
        "terca": {"title": "Treino B: Costas, Bíceps e Panturrilhas", "subtitle": "Puxadas de alta intensidade, espessura dorsal e flexão plantar pesada.", "exercises": []},
        "quarta": {"title": "Treino C: Braços, Deltoide Posterior e Panturrilhas", "subtitle": "Super-compensação de bíceps, tríceps e deltoides posteriores.", "exercises": []},
        "quinta": {"title": "Treino D: Pernas Completas (O Dia Único)", "subtitle": "Treino lendário de membros inferiores: quadríceps, posteriores e glúteos.", "exercises": []},
        "sexta": {"title": "Treino E: Ombros e Abdômen", "subtitle": "Largura clavicular, deltoides 3D e fortalecimento pesado de core.", "exercises": []},
        "sabado": {"title": "Descanso ou Recuperação Ativa", "subtitle": "Cardio leve, caminhada ou mobilidade articular.", "exercises": []},
        "domingo": {"title": "Descanso Total", "subtitle": "Recuperação completa para reiniciar o ciclo com força máxima.", "exercises": []}
    }

    day_map = {
        "Treino A": "segunda",
        "Treino B": "terca",
        "Treino C": "quarta",
        "Treino D": "quinta",
        "Treino E": "sexta"
    }

    current_key = None

    for line in lines:
        line_str = line.strip()
        if line_str.startswith("## Treino"):
            for prefix, key in day_map.items():
                if prefix in line_str:
                    current_key = key
                    title_clean = line_str.replace("## ", "")
                    workouts[current_key]["title"] = title_clean
                    break
        elif line_str.startswith("|") and not line_str.startswith("| :---") and not line_str.startswith("| Exercício"):
            parts = [p.strip() for p in line.split("|")[1:-1]]
            if len(parts) >= 9 and current_key:
                name = parts[0]
                sets = int(parts[1])
                reps = parts[2]
                rir = int(parts[5])
                rest = int(parts[6].replace("s", ""))
                tech_raw = parts[7]
                cadence = parts[8]
                
                tech_title = tech_raw.split(":")[0].strip() if ":" in tech_raw else tech_raw

                workouts[current_key]["exercises"].append({
                    "name": name,
                    "sets": sets,
                    "reps": reps,
                    "rir": rir,
                    "rest": rest,
                    "technique": tech_title,
                    "cadence": cadence,
                    "tip": tech_raw
                })

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(workouts, f, indent=2, ensure_ascii=False)

    total_ex = sum(len(w["exercises"]) for w in workouts.values())
    print(f"planejamento.json atualizado com sucesso! Total de {total_ex} exercícios.")

if __name__ == "__main__":
    convert()
