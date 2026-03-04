import os
import yaml  # We'll use this to safely read/append

# ... (keep your extract_number function the same)

def add_one_gallery():
    folder = input("\nEnter folder name (press Enter to quit): ").strip()
    if not folder:
        return False

    title = input("Enter gallery title (or Enter to use folder name): ").strip()
    if not title:
        title = folder.replace('-', ' ').title()

    photo_path = os.path.join('assets', 'gallery', folder)
    if not os.path.isdir(photo_path):
        print(f"Folder not found: {photo_path}. Skipping.")
        return True

    extensions = ('.jpg', '.jpeg', '.png', '.webp')
    photos = [f for f in os.listdir(photo_path) if f.lower().endswith(extensions)]
    if not photos:
        print("No images found. Skipping.")
        return True

    photos.sort(key=extract_number)
    if all(extract_number(p) == float('inf') for p in photos):
        photos.sort()

    cover = photos[0]

    yml_path = os.path.join('_data', 'gallery.yml')

    # Load existing data safely
    data = {}
    if os.path.exists(yml_path):
        with open(yml_path, 'r') as f:
            try:
                data = yaml.safe_load(f) or {}
            except yaml.YAMLError:
                print("Warning: Existing gallery.yml has invalid YAML. Starting fresh under 'albums:'.")
                data = {}

    # Ensure 'albums' is a list
    if 'albums' not in data or not isinstance(data['albums'], list):
        data['albums'] = []

    # Check if this folder already exists (avoid duplicates)
    exists = any(a.get('folder') == folder for a in data['albums'])
    if exists:
        print(f"Gallery '{folder}' already exists. Skipping.")
        return True

    # Append new entry
    new_entry = {
        'title': title,
        'folder': folder,
        'cover': cover,
        'photos': photos
    }
    data['albums'].append(new_entry)

    # Write back (overwrites file with full structure)
    with open(yml_path, 'w') as f:
        yaml.safe_dump(data, f, default_flow_style=False, sort_keys=False)

    print(f"Added '{title}' under albums: ({len(photos)} images, cover: {cover})")
    return True

# Batch loop
print("Add galleries (Enter blank folder to finish):\n")
while add_one_gallery():
    pass

print("Done! Run 'bundle exec jekyll serve' to see updates.")