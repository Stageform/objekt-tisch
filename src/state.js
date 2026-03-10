// src/state.js - Global State Management

class AppState {
  constructor() {
    this.openBlocks = []; // Array of { id, variant, x, y, rotation, contactActive, countdownId }
    this.activeVariants = new Map(); // Map of id -> currentVariantIndex
    this.countdowns = new Map(); // Map of id -> timeoutId
  }

  addBlock(id, x, y, rotation = 0) {
    // Prevent duplicate IDs
    if (this.openBlocks.some(block => block.id === id)) {
      return null;
    }
    
    const block = {
      id,
      variant: this.activeVariants.get(id) || 0,
      x,
      y,
      rotation,
      contactActive: true
    };
    
    this.openBlocks.push(block);
    return block;
  }

  removeBlock(id) {
    this.openBlocks = this.openBlocks.filter(block => block.id !== id);
    this.clearCountdown(id);
  }

  getBlock(id) {
    return this.openBlocks.find(block => block.id === id);
  }

  updateBlockPosition(id, x, y) {
    const block = this.getBlock(id);
    if (block) {
      block.x = x;
      block.y = y;
    }
  }

  updateBlockRotation(id, rotation) {
    const block = this.getBlock(id);
    if (block) {
      block.rotation = rotation;
      const variantIndex = Math.floor((rotation / 360) * 4) % 4;
      block.variant = variantIndex;
      this.activeVariants.set(id, variantIndex);
    }
  }

  setVariant(id, variantIndex) {
    this.activeVariants.set(id, variantIndex);
    const block = this.getBlock(id);
    if (block) {
      block.variant = variantIndex;
    }
  }

  startCountdown(id, duration = 10000) {
    this.clearCountdown(id);
    const block = this.getBlock(id);
    if (block) {
      block.contactActive = false;
      const countdownId = setTimeout(() => {
        this.removeBlock(id);
      }, duration);
      this.countdowns.set(id, countdownId);
    }
  }

  clearCountdown(id) {
    if (this.countdowns.has(id)) {
      clearTimeout(this.countdowns.get(id));
      this.countdowns.delete(id);
    }
    const block = this.getBlock(id);
    if (block) {
      block.contactActive = true;
    }
  }

  getAllBlocks() {
    return this.openBlocks;
  }

  clear() {
    this.countdowns.forEach(timeoutId => clearTimeout(timeoutId));
    this.openBlocks = [];
    this.activeVariants.clear();
    this.countdowns.clear();
  }
}

const appState = new AppState();
export default appState;