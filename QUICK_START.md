# Quick Start — IntelliAttend

Get up and running in under 1 minute.

## Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) installed
- Git installed
- A GitHub account

## Setup

```bash
# 1. Fork the repo on GitHub (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/IntelliAttend.git
cd IntelliAttend

# 3. Install dependencies
flutter pub get

# 4. Run the app
flutter run
```

## Making Changes

1. Create a branch: `git checkout -b cosmetic/your-feature`
2. Edit files ONLY in:
   - `lib/presentation/` (screens & widgets)
   - `lib/Theme/` (styles & colors)
   - `assets/` (images & fonts)
3. Test: `flutter run`
4. Push & open a PR

## Do NOT Touch
- `lib/Core/`
- `lib/Data/`
- `lib/Services/`
- `lib/engine/`
- `main.dart`

See [COLLABORATION_GUIDE.md](COLLABORATION_GUIDE.md) for full details.
