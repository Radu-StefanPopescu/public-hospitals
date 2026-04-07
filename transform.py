import csv
import json

def transform_csv_to_json():
    hospitals = []
    seen_hospitals = set()  # Track unique hospitals
    
    # Try different encodings
    encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            with open('spitale.csv', 'r', encoding=encoding) as file:
                reader = csv.DictReader(file)
                
                for row in reader:
                    # Create hospital record
                    hospital = {
                        'id': row.get('Titlu', '').strip(),
                        'name': row.get('nume', '').strip(),
                        'lat': float(row.get('latitudine', 0).strip()) if row.get('latitudine', '').strip() else None,
                        'lng': float(row.get('longitudine', 0).strip()) if row.get('longitudine', '').strip() else None
                    }
                    
                    # Skip if missing coordinates
                    if hospital['lat'] is None or hospital['lng'] is None:
                        continue
                    
                    # Create deduplication key based on name and coordinates
                    # Normalize name by removing extra whitespace and converting to lowercase
                    normalized_name = ' '.join(hospital['name'].lower().split())
                    coord_key = f"{hospital['lat']:.6f},{hospital['lng']:.6f}"
                    dedupe_key = f"{normalized_name}_{coord_key}"
                    
                    # Only add if not seen before
                    if dedupe_key not in seen_hospitals:
                        seen_hospitals.add(dedupe_key)
                        hospitals.append(hospital)
            break  # Success, exit the encoding loop
        except UnicodeDecodeError:
            continue
    
    with open('hospitals.json', 'w', encoding='utf-8') as json_file:
        json.dump(hospitals, json_file, ensure_ascii=False, indent=2)
    
    print(f"Transformed {len(hospitals)} unique hospitals to hospitals.json")
    print(f"Removed {len(seen_hospitals) - len(hospitals)} duplicates")
    return hospitals

if __name__ == "__main__":
    transform_csv_to_json()