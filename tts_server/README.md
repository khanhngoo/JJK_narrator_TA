# TTS Server - Fish Speech S2-Mini

Self-hosted TTS using Fish Speech with S2-Mini model (good quality, 12GB VRAM).

## Requirements

- **GPU:** 12GB+ VRAM (RTX 3060, 3080, 4090, etc.)
- **OS:** Linux (Ubuntu 20.04+), WSL, or macOS
- **Disk:** ~10GB for model weights
- **Python:** 3.10 or 3.12

## Quick Setup on Your Server

### 1. Clone Fish Speech

```bash
git clone https://github.com/fishaudio/fish-speech.git
cd fish-speech
```

### 2. Install Dependencies

```bash
# Create conda environment (recommended)
conda create -n fish-speech python=3.12
conda activate fish-speech

# Install with CUDA support (for NVIDIA GPU)
pip install -e .[cu128]  # or cu126 for older CUDA
```

### 3. Download S2-Mini Model

```bash
# Create checkpoints directory
mkdir -p checkpoints

# Download S2-Mini model (smaller, faster, 12GB VRAM friendly)
huggingface-cli download fishaudio/s2-mini --local-dir checkpoints/s2-mini
```

### 4. Start API Server

```bash
python tools/api_server.py \
  --llama-checkpoint-path checkpoints/s2-mini \
  --decoder-checkpoint-path checkpoints/s2-mini/codec.pth \
  --device cuda \
  --listen 0.0.0.0:8080
```

### 5. Test It

```bash
# Health check
curl http://localhost:8080/v1/health
# Should return: {"status":"ok"}

# Test TTS
python tools/api_client.py \
  --url http://localhost:8080/v1/tts \
  --text "And thus, the truth reveals itself..." \
  --output test
```

---

## For Custom Voice (Zero-Shot Cloning)

### 1. Prepare Reference Audio

Get 10-30 seconds of audio with the voice you want. Save as `.wav` file (16kHz, mono).

### 2. Use Zero-Shot Cloning

```bash
python tools/api_client.py \
  --url http://localhost:8080/v1/tts \
  --text "Your narration text here" \
  --reference_audio path/to/your/audio.wav \
  --output narration
```

That's it! No training needed for zero-shot cloning.

---

## Docker Setup (Alternative)

```bash
# Clone repo
git clone https://github.com/fishaudio/fish-speech.git
cd fish-speech

# Start with Docker (auto-installs on first run)
docker compose --profile server up

# S2-Mini specific
BACKEND=cuda docker compose --profile server up
```

---

## Web App Configuration

Add to your `.env.local`:

```bash
FISH_SPEECH_URL=http://YOUR_SERVER_IP:8080
```

Your Next.js app will call this server for TTS.

---

## Troubleshooting

### "CUDA out of memory"
- S2-Mini requires ~12GB. Use S2-Mini-Echo (smaller) or close other GPU processes.

### "Module not found"
- Run `pip install -e .` in the fish-speech directory.

### "Permission denied"
- Check if port 8080 is already in use: `lsof -i :8080`

---

## File Structure

```
fish-speech/
├── checkpoints/
│   └── s2-mini/           # Downloaded model
│       ├── config.json
│       ├── model.*         # LLAMA weights
│       └── codec.pth       # Decoder weights
├── tools/
│   ├── api_server.py       # API server
│   └── api_client.py       # Test client
├── fish_speech/            # Core code
└── README.md
```

---

## Next Steps

1. SSH into your server
2. Follow steps 1-4 above
3. Get a JJK narrator audio sample (10-30 sec)
4. Test with zero-shot cloning
5. Point your web app to your server's IP
