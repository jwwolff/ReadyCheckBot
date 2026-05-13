#!/bin/bash
set -e

IMAGE="jwwolff/readycheckbot"
TAG="${1:-latest}"

# Create a buildx builder with QEMU emulation for cross-platform builds
echo "Setting up multi-platform builder..."
docker buildx rm multi-arch-builder 2>/dev/null || true
docker buildx create --name multi-arch-builder --use
docker buildx inspect --bootstrap

echo "Installing QEMU static binaries for cross-platform builds..."
docker run --privileged --rm tonistiigi/binfmt --install all 2>/dev/null || true

echo "Building multi-platform image: ${IMAGE}:${TAG}"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    -t "${IMAGE}:${TAG}" \
    --push \
    .

# Clean up builder so it doesn't consume resources
docker buildx rm multi-arch-builder 2>/dev/null || true

echo "Built and pushed: ${IMAGE}:${TAG} (linux/amd64, linux/arm64)"
