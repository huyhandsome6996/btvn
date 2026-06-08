'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ============================================================
// CONSTANTS
// ============================================================
const TILE = 32
const MAP_W = 40
const MAP_H = 30
const CANVAS_W = 800
const CANVAS_H = 600
const VIEW_TILES_X = Math.ceil(CANVAS_W / TILE) + 2
const VIEW_TILES_Y = Math.ceil(CANVAS_H / TILE) + 2

// Tile types
const T = {
  FLOOR: 0, WALL: 1, DOOR: 2, STAIRS: 3,
  CHEST: 4, POTION: 5, TRAP: 6, SPIKE: 7,
}

// Colors - pixel art palette
const C = {
  floor1: '#2a2a3e', floor2: '#252538',
  wall1: '#4a4a5e', wall2: '#3a3a4e', wall3: '#5a5a6e',
  door: '#8B4513', doorFrame: '#654321',
  stairs: '#c8a84e', stairsDark: '#a08030',
  chest: '#c8a84e', chestDark: '#8B6914', chestLid: '#daa520',
  potion: '#e74c3c', potionGlass: '#c0392b', potionShine: '#ff6b6b',
  trap: '#555', spike: '#888',
  hero: '#4fc3f7', heroDark: '#0288d1', heroSkin: '#ffcc80',
  heroHair: '#5d4037', heroArmor: '#78909c', heroCape: '#e53935',
  slime: '#4caf50', slimeDark: '#2e7d32', slimeEye: '#fff',
  skeleton: '#e0e0e0', skeletonDark: '#9e9e9e', skeletonEye: '#f44336',
  bat: '#7b1fa2', batWing: '#4a148c', batEye: '#ff5722',
  boss: '#ff5722', bossDark: '#bf360c', bossEye: '#ffeb3b',
  hpBar: '#e74c3c', hpBg: '#3a0000', mpBar: '#2196f3', mpBg: '#001a3a',
  xpBar: '#4caf50', xpBg: '#003a00',
  gold: '#ffd700', damage: '#ff4444', heal: '#44ff44',
  crit: '#ffaa00', miss: '#888',
  shadow: 'rgba(0,0,0,0.3)',
  textWhite: '#fff', textYellow: '#ffd700', textGray: '#aaa',
  torch: '#ff9800', torchGlow: 'rgba(255,152,0,0.15)',
  fog: 'rgba(0,0,0,0.7)',
}

// ============================================================
// TYPES
// ============================================================
interface Position { x: number; y: number }
interface Stats { hp: number; maxHp: number; mp: number; maxMp: number; atk: number; def: number; spd: number; xp: number; xpNext: number; level: number; gold: number }
interface Item { name: string; type: 'weapon' | 'armor' | 'potion' | 'key'; value: number; desc: string; icon: string }
interface Enemy {
  id: string; name: string; x: number; y: number; hp: number; maxHp: number
  atk: number; def: number; xp: number; gold: number; type: 'slime' | 'skeleton' | 'bat' | 'boss'
  alive: boolean; moveTimer: number; animFrame: number
}
interface FloatingText { x: number; y: number; text: string; color: string; life: number; maxLife: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; size: number }
interface GameLog { text: string; color: string; time: number }
interface PlayerState {
  pos: Position; stats: Stats; inventory: Item[]; direction: number
  animFrame: number; moveCD: number; attackCD: number; isAttacking: boolean
  keys: number; floor: number; explored: Set<string>
}

// ============================================================
// MAP GENERATION
// ============================================================
function generateDungeon(floor: number): { map: number[][]; enemies: Enemy[]; items: { x: number; y: number; item: Item }[]; startPos: Position; stairsPos: Position } {
  const map: number[][] = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(T.WALL))
  const rooms: { x: number; y: number; w: number; h: number }[] = []
  const numRooms = 6 + Math.min(floor, 4)
  const difficulty = Math.min(floor, 10)

  // Place rooms
  for (let i = 0; i < numRooms * 3; i++) {
    if (rooms.length >= numRooms) break
    const w = 4 + Math.floor(Math.random() * 5)
    const h = 4 + Math.floor(Math.random() * 4)
    const x = 1 + Math.floor(Math.random() * (MAP_W - w - 2))
    const y = 1 + Math.floor(Math.random() * (MAP_H - h - 2))
    let overlap = false
    for (const r of rooms) {
      if (x < r.x + r.w + 1 && x + w + 1 > r.x && y < r.y + r.h + 1 && y + h + 1 > r.y) { overlap = true; break }
    }
    if (!overlap) {
      rooms.push({ x, y, w, h })
      for (let ry = y; ry < y + h; ry++)
        for (let rx = x; rx < x + w; rx++)
          map[ry][rx] = T.FLOOR
    }
  }

  // Connect rooms with corridors
  for (let i = 1; i < rooms.length; i++) {
    const a = { x: Math.floor(rooms[i - 1].x + rooms[i - 1].w / 2), y: Math.floor(rooms[i - 1].y + rooms[i - 1].h / 2) }
    const b = { x: Math.floor(rooms[i].x + rooms[i].w / 2), y: Math.floor(rooms[i].y + rooms[i].h / 2) }
    let cx = a.x, cy = a.y
    while (cx !== b.x) { map[cy][cx] = T.FLOOR; cx += cx < b.x ? 1 : -1 }
    while (cy !== b.y) { map[cy][cx] = T.FLOOR; cy += cy < b.y ? 1 : -1 }
    map[cy][cx] = T.FLOOR
  }

  // Doors between corridors and rooms
  for (const room of rooms) {
    const doorPositions = [
      { x: room.x - 1, y: Math.floor(room.y + room.h / 2) },
      { x: room.x + room.w, y: Math.floor(room.y + room.h / 2) },
      { x: Math.floor(room.x + room.w / 2), y: room.y - 1 },
      { x: Math.floor(room.x + room.w / 2), y: room.y + room.h },
    ]
    for (const dp of doorPositions) {
      if (dp.x > 0 && dp.x < MAP_W - 1 && dp.y > 0 && dp.y < MAP_H - 1 && map[dp.y][dp.x] === T.FLOOR && Math.random() < 0.3) {
        map[dp.y][dp.x] = T.DOOR
      }
    }
  }

  const startPos = { x: Math.floor(rooms[0].x + rooms[0].w / 2), y: Math.floor(rooms[0].y + rooms[0].h / 2) }
  const lastRoom = rooms[rooms.length - 1]
  const stairsPos = { x: Math.floor(lastRoom.x + lastRoom.w / 2), y: Math.floor(lastRoom.y + lastRoom.h / 2) }
  map[stairsPos.y][stairsPos.x] = T.STAIRS

  // Place items
  const items: { x: number; y: number; item: Item }[] = []
  const potionNames = ['Bình Máu Nhỏ', 'Bình Máu Lớn', 'Bình Phép', 'Bình Kháng']
  const potionIcons = ['❤️', '💖', '💎', '🛡️']
  const weaponNames = ['Kiếm Sắt', 'Kiếm Lửa', 'Rìu Chiến', 'Cung Tiên']
  const weaponIcons = ['⚔️', '🔥', '🪓', '🏹']

  for (let i = 1; i < rooms.length - 1; i++) {
    const room = rooms[i]
    const ix = room.x + 1 + Math.floor(Math.random() * (room.w - 2))
    const iy = room.y + 1 + Math.floor(Math.random() * (room.h - 2))
    if (map[iy][ix] === T.FLOOR) {
      const r = Math.random()
      if (r < 0.4) {
        const pi = Math.floor(Math.random() * potionNames.length)
        items.push({ x: ix, y: iy, item: { name: potionNames[pi], type: 'potion', value: (pi + 1) * 15, desc: `Hồi ${15 + pi * 15} HP`, icon: potionIcons[pi] } })
        map[iy][ix] = T.POTION
      } else if (r < 0.6) {
        const wi = Math.min(Math.floor(Math.random() * weaponNames.length), difficulty)
        items.push({ x: ix, y: iy, item: { name: weaponNames[wi], type: 'weapon', value: 3 + wi * 2 + difficulty, desc: `+${3 + wi * 2 + difficulty} ATK`, icon: weaponIcons[wi] } })
        map[iy][ix] = T.CHEST
      } else if (r < 0.75) {
        items.push({ x: ix, y: iy, item: { name: 'Chìa Khóa', type: 'key', value: 1, desc: 'Mở cửa khóa', icon: '🔑' } })
        map[iy][ix] = T.CHEST
      }
    }
  }

  // Place traps
  for (let i = 1; i < rooms.length; i++) {
    if (Math.random() < 0.2 + difficulty * 0.05) {
      const room = rooms[i]
      const tx = room.x + 1 + Math.floor(Math.random() * (room.w - 2))
      const ty = room.y + 1 + Math.floor(Math.random() * (room.h - 2))
      if (map[ty][tx] === T.FLOOR) map[ty][tx] = T.TRAP
    }
  }

  // Place enemies
  const enemies: Enemy[] = []
  const enemyTypes: Array<'slime' | 'skeleton' | 'bat'> = ['slime', 'skeleton', 'bat']
  let enemyId = 0
  for (let i = 1; i < rooms.length; i++) {
    const room = rooms[i]
    const numEnemies = 1 + Math.floor(Math.random() * (1 + difficulty * 0.3))
    for (let j = 0; j < numEnemies; j++) {
      const ex = room.x + 1 + Math.floor(Math.random() * (room.w - 2))
      const ey = room.y + 1 + Math.floor(Math.random() * (room.h - 2))
      if (map[ey][ex] === T.FLOOR && !(ex === startPos.x && ey === startPos.y)) {
        const et = enemyTypes[Math.floor(Math.random() * Math.min(enemyTypes.length, 1 + difficulty))]
        const baseStats = { slime: { hp: 20, atk: 3, def: 1, xp: 10, gold: 5 }, skeleton: { hp: 35, atk: 6, def: 3, xp: 20, gold: 10 }, bat: { hp: 15, atk: 8, def: 0, xp: 15, gold: 7 } }
        const s = baseStats[et]
        const scale = 1 + (difficulty - 1) * 0.2
        enemies.push({
          id: `e${floor}_${enemyId++}`, name: et === 'slime' ? 'Slime' : et === 'skeleton' ? 'Bộ Xương' : 'Dơi Ma',
          x: ex, y: ey, hp: Math.floor(s.hp * scale), maxHp: Math.floor(s.hp * scale),
          atk: Math.floor(s.atk * scale), def: Math.floor(s.def * scale),
          xp: Math.floor(s.xp * scale), gold: Math.floor(s.gold * scale),
          type: et, alive: true, moveTimer: 0, animFrame: 0
        })
      }
    }
  }

  // Boss on every 3rd floor
  if (floor % 3 === 0) {
    const bossRoom = rooms[rooms.length - 2] || rooms[rooms.length - 1]
    const bx = Math.floor(bossRoom.x + bossRoom.w / 2)
    const by = Math.floor(bossRoom.y + bossRoom.h / 2)
    const scale = 1 + (floor - 1) * 0.3
    enemies.push({
      id: `boss_${floor}`, name: `Quái Vật Tầng ${floor}`, x: bx, y: by,
      hp: Math.floor(80 * scale), maxHp: Math.floor(80 * scale),
      atk: Math.floor(12 * scale), def: Math.floor(5 * scale),
      xp: Math.floor(100 * scale), gold: Math.floor(50 * scale),
      type: 'boss', alive: true, moveTimer: 0, animFrame: 0
    })
  }

  return { map, enemies, items, startPos, stairsPos }
}

// ============================================================
// PIXEL DRAWING HELPERS
// ============================================================
function drawPixelChar(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, colors: string[], pixels: number[][]) {
  for (let py = 0; py < pixels.length; py++) {
    for (let px = 0; px < pixels[py].length; px++) {
      const ci = pixels[py][px]
      if (ci > 0) {
        ctx.fillStyle = colors[ci]
        ctx.fillRect(x + px * s, y + py * s, s, s)
      }
    }
  }
}

// Hero sprite 8x10 pixel art
const HERO_SPRITE = [
  [0,0,3,3,3,3,0,0],
  [0,3,3,3,3,3,3,0],
  [0,3,2,3,2,3,0,0],
  [0,3,3,3,3,3,3,0],
  [0,0,3,1,3,0,0,0],
  [4,4,5,1,5,4,4,0],
  [0,4,5,5,5,4,0,0],
  [0,0,5,0,5,0,0,0],
  [0,0,6,0,6,0,0,0],
  [0,0,6,0,6,0,0,0],
]
// 0=transparent, 1=skin, 2=eye, 3=hair, 4=armor, 5=cape, 6=boot

const SLIME_SPRITE = [
  [0,0,0,1,1,0,0,0],
  [0,0,1,1,1,1,0,0],
  [0,1,2,1,2,1,1,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
]

const SKELETON_SPRITE = [
  [0,0,1,1,1,0,0,0],
  [0,1,2,1,2,1,0,0],
  [0,0,1,1,1,0,0,0],
  [0,0,0,1,0,0,0,0],
  [0,1,0,1,0,1,0,0],
  [0,0,0,1,0,0,0,0],
  [0,0,0,1,0,0,0,0],
  [0,0,1,0,1,0,0,0],
]

const BAT_SPRITE = [
  [1,0,0,0,0,0,1,0],
  [1,1,0,0,0,1,1,0],
  [1,1,1,1,1,1,1,0],
  [0,1,2,1,2,1,0,0],
  [0,0,1,1,1,0,0,0],
  [0,0,0,1,0,0,0,0],
]

const BOSS_SPRITE = [
  [0,1,1,0,0,1,1,0],
  [1,2,1,1,1,1,2,1],
  [1,1,1,1,1,1,1,1],
  [0,1,3,1,3,1,0,0],
  [0,1,1,1,1,1,0,0],
  [1,1,1,1,1,1,1,1],
  [1,0,1,1,1,0,1,0],
  [0,0,1,0,1,0,0,0],
  [0,0,1,0,1,0,0,0],
]

// ============================================================
// MAIN GAME COMPONENT
// ============================================================
export default function PixelDungeonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<'title' | 'playing' | 'dead' | 'win'>('title')
  const playerRef = useRef<PlayerState>({
    pos: { x: 5, y: 5 }, stats: { hp: 100, maxHp: 100, mp: 30, maxMp: 30, atk: 10, def: 5, spd: 5, xp: 0, xpNext: 50, level: 1, gold: 0 },
    inventory: [], direction: 0, animFrame: 0, moveCD: 0, attackCD: 0, isAttacking: false, keys: 0, floor: 1, explored: new Set<string>()
  })
  const mapRef = useRef<number[][]>([])
  const enemiesRef = useRef<Enemy[]>([])
  const itemsRef = useRef<{ x: number; y: number; item: Item }[]>([])
  const stairsRef = useRef<Position>({ x: 0, y: 0 })
  const floatsRef = useRef<FloatingText[]>([])
  const particlesRef = useRef<Particle[]>([])
  const logsRef = useRef<GameLog[]>([])
  const keysRef = useRef<Set<string>>(new Set())
  const frameRef = useRef(0)
  const gameTimeRef = useRef(0)
  const [logs, setLogs] = useState<GameLog[]>([])
  const [playerStats, setPlayerStats] = useState<Stats>({ hp: 100, maxHp: 100, mp: 30, maxMp: 30, atk: 10, def: 5, spd: 5, xp: 0, xpNext: 50, level: 1, gold: 0 })
  const [inventory, setInventory] = useState<Item[]>([])
  const [currentFloor, setCurrentFloor] = useState(1)
  const [playerKeys, setPlayerKeys] = useState(0)

  const addLog = useCallback((text: string, color: string = C.textWhite) => {
    const log: GameLog = { text, color, time: Date.now() }
    logsRef.current = [...logsRef.current.slice(-50), log]
    setLogs(prev => [...prev.slice(-50), log])
  }, [])

  const addFloat = useCallback((x: number, y: number, text: string, color: string) => {
    floatsRef.current.push({ x, y, text, color, life: 60, maxLife: 60 })
  }, [])

  const addParticles = useCallback((x: number, y: number, color: string, count: number = 5) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x, y, vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3 - 1,
        life: 20 + Math.random() * 20, color, size: 2 + Math.random() * 3
      })
    }
  }, [])

  const updatePlayerKeys = useCallback((keys: number) => { setPlayerKeys(keys) }, [])

  const initFloor = useCallback((floor: number) => {
    const dungeon = generateDungeon(floor)
    mapRef.current = dungeon.map
    enemiesRef.current = dungeon.enemies
    itemsRef.current = dungeon.items
    stairsRef.current = dungeon.stairsPos
    playerRef.current.pos = { ...dungeon.startPos }
    playerRef.current.floor = floor
    playerRef.current.explored = new Set<string>()
    playerRef.current.isAttacking = false
    setCurrentFloor(floor)
    addLog(`── Tầng ${floor} ──`, C.textYellow)
    if (floor % 3 === 0) addLog('⚠️ Có quái vật mạnh ở tầng này!', C.damage)
  }, [addLog])

  const gainXP = useCallback((amount: number) => {
    const p = playerRef.current
    p.stats.xp += amount
    while (p.stats.xp >= p.stats.xpNext) {
      p.stats.xp -= p.stats.xpNext
      p.stats.level++
      p.stats.maxHp += 15
      p.stats.hp = Math.min(p.stats.hp + 15, p.stats.maxHp)
      p.stats.maxMp += 5
      p.stats.mp = Math.min(p.stats.mp + 5, p.stats.maxMp)
      p.stats.atk += 2
      p.stats.def += 1
      p.stats.xpNext = Math.floor(p.stats.xpNext * 1.5)
      addLog(`🎉 LÊN CẤP ${p.stats.level}! HP+15 ATK+2 DEF+1`, C.textYellow)
      addParticles(p.pos.x * TILE + TILE / 2, p.pos.y * TILE + TILE / 2, C.textYellow, 15)
    }
    setPlayerStats({ ...p.stats })
  }, [addLog, addParticles])

  const attackEnemy = useCallback((enemy: Enemy) => {
    const p = playerRef.current
    const crit = Math.random() < 0.15
    const miss = Math.random() < 0.05
    if (miss) {
      addFloat(enemy.x, enemy.y, 'MISS', C.miss)
      addLog('Tấn công hụt!', C.miss)
      return
    }
    let dmg = Math.max(1, p.stats.atk - enemy.def + Math.floor(Math.random() * 3))
    if (crit) dmg = Math.floor(dmg * 2)
    enemy.hp -= dmg
    addFloat(enemy.x, enemy.y, `-${dmg}`, crit ? C.crit : C.damage)
    addParticles(enemy.x * TILE + TILE / 2, enemy.y * TILE + TILE / 2, C.damage, crit ? 10 : 5)
    addLog(`⚔️ Đánh ${enemy.name} ${crit ? 'CHÍM MẠNG ' : ''}${dmg} sát thương!`, crit ? C.crit : C.damage)

    if (enemy.hp <= 0) {
      enemy.alive = false
      addLog(`💀 Tiêu diệt ${enemy.name}! +${enemy.xp}XP +${enemy.gold}G`, C.xpBar)
      gainXP(enemy.xp)
      p.stats.gold += enemy.gold
      setPlayerStats({ ...p.stats })
      addParticles(enemy.x * TILE + TILE / 2, enemy.y * TILE + TILE / 2, enemy.type === 'boss' ? C.textYellow : C.damage, 20)
      if (enemy.type === 'boss') addLog('🏆 Đã hạ quái vật!', C.textYellow)
    }
  }, [addFloat, addParticles, addLog, gainXP])

  const enemyAttack = useCallback((enemy: Enemy) => {
    const p = playerRef.current
    const dmg = Math.max(1, enemy.atk - p.stats.def + Math.floor(Math.random() * 3))
    p.stats.hp -= dmg
    addFloat(p.pos.x, p.pos.y, `-${dmg}`, C.damage)
    addLog(`👹 ${enemy.name} đánh bạn ${dmg} sát thương!`, C.damage)
    setPlayerStats({ ...p.stats })
    if (p.stats.hp <= 0) {
      setGameState('dead')
      addLog('💀 Bạn đã bị tiêu diệt...', C.damage)
    }
  }, [addFloat, addLog])

  const tryMove = useCallback((dx: number, dy: number) => {
    const p = playerRef.current
    const nx = p.pos.x + dx
    const ny = p.pos.y + dy
    if (nx < 0 || nx >= MAP_W || ny < 0 || ny >= MAP_H) return

    const tile = mapRef.current[ny][nx]

    // Direction
    if (dx > 0) p.direction = 3
    else if (dx < 0) p.direction = 1
    else if (dy > 0) p.direction = 0
    else if (dy < 0) p.direction = 2

    // Wall
    if (tile === T.WALL) return

    // Door - đi vào là mở
    if (tile === T.DOOR) {
      mapRef.current[ny][nx] = T.FLOOR
      addLog('🚪 Mở cửa!', C.textYellow)
      // Di chuyển vào vị trí cửa vừa mở
      p.pos.x = nx
      p.pos.y = ny
      p.moveCD = 6
      p.animFrame = (p.animFrame + 1) % 4
      addParticles(nx * TILE + TILE / 2, ny * TILE + TILE / 2, C.textYellow, 5)
    }

    // Enemy at position - attack
    const enemy = enemiesRef.current.find(e => e.alive && e.x === nx && e.y === ny)
    if (enemy) {
      p.isAttacking = true
      p.attackCD = 15
      attackEnemy(enemy)
      return
    }

    // Move
    p.pos.x = nx
    p.pos.y = ny
    p.moveCD = 6
    p.animFrame = (p.animFrame + 1) % 4

    // Pick up items
    const itemIdx = itemsRef.current.findIndex(it => it.x === nx && it.y === ny)
    if (itemIdx >= 0) {
      const worldItem = itemsRef.current[itemIdx]
      if (worldItem.item.type === 'potion') {
        const healed = Math.min(worldItem.item.value, p.stats.maxHp - p.stats.hp)
        p.stats.hp += healed
        addLog(`${worldItem.item.icon} Dùng ${worldItem.item.name}! +${healed}HP`, C.heal)
        addFloat(nx, ny, `+${healed}`, C.heal)
        addParticles(nx * TILE + TILE / 2, ny * TILE + TILE / 2, C.heal, 8)
        itemsRef.current.splice(itemIdx, 1)
        mapRef.current[ny][nx] = T.FLOOR
      } else {
        p.inventory.push(worldItem.item)
        if (worldItem.item.type === 'weapon') {
          p.stats.atk += worldItem.item.value
          addLog(`${worldItem.item.icon} Nhận ${worldItem.item.name}! ${worldItem.item.desc}`, C.textYellow)
        } else if (worldItem.item.type === 'key') {
          p.keys++
          addLog('🔑 Nhặt chìa khóa!', C.textYellow)
          updatePlayerKeys(p.keys)
        }
        itemsRef.current.splice(itemIdx, 1)
        mapRef.current[ny][nx] = T.FLOOR
        setInventory([...p.inventory])
      }
      setPlayerStats({ ...p.stats })
    }

    // Trap
    if (tile === T.TRAP) {
      const trapDmg = 5 + Math.floor(Math.random() * 10)
      p.stats.hp -= trapDmg
      addLog(`⚠️ Bẫu! -${trapDmg}HP`, C.damage)
      addFloat(nx, ny, `-${trapDmg}`, C.damage)
      addParticles(nx * TILE + TILE / 2, ny * TILE + TILE / 2, C.damage, 8)
      mapRef.current[ny][nx] = T.FLOOR
      setPlayerStats({ ...p.stats })
      if (p.stats.hp <= 0) setGameState('dead')
    }

    // Stairs
    if (tile === T.STAIRS) {
      const nextFloor = p.floor + 1
      if (nextFloor > 10) {
        setGameState('win')
        addLog('🏆 CHIẾN THẮNG! Bạn đã chinh phục hầm ngục!', C.textYellow)
      } else {
        p.stats.hp = Math.min(p.stats.hp + 20, p.stats.maxHp)
        addLog('🪜 Đi xuống tầng tiếp theo... +20HP', C.heal)
        initFloor(nextFloor)
        setPlayerStats({ ...p.stats })
      }
    }
  }, [addLog, addFloat, addParticles, attackEnemy, initFloor])

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const player = playerRef.current
    let animId: number

    const update = () => {
      const p = playerRef.current
      gameTimeRef.current++

      // Player input
      if (p.moveCD > 0) p.moveCD--
      if (p.attackCD > 0) { p.attackCD--; if (p.attackCD === 0) p.isAttacking = false }

      if (p.moveCD === 0) {
        const k = keysRef.current
        if (k.has('ArrowUp') || k.has('w') || k.has('W')) tryMove(0, -1)
        else if (k.has('ArrowDown') || k.has('s') || k.has('S')) tryMove(0, 1)
        else if (k.has('ArrowLeft') || k.has('a') || k.has('A')) tryMove(-1, 0)
        else if (k.has('ArrowRight') || k.has('d') || k.has('D')) tryMove(1, 0)
      }

      // Use potion with 1-5 keys
      const k = keysRef.current
      for (let i = 1; i <= 5; i++) {
        if (k.has(String(i))) {
          const potionIdx = p.inventory.findIndex(it => it.type === 'potion')
          if (potionIdx >= 0) {
            const potion = p.inventory[potionIdx]
            const healed = Math.min(potion.value, p.stats.maxHp - p.stats.hp)
            p.stats.hp += healed
            addLog(`${potion.icon} Dùng ${potion.name}! +${healed}HP`, C.heal)
            addFloat(p.pos.x, p.pos.y, `+${healed}`, C.heal)
            p.inventory.splice(potionIdx, 1)
            setInventory([...p.inventory])
            setPlayerStats({ ...p.stats })
          }
          k.delete(String(i))
        }
      }

      // Update fog of war
      for (let dy = -4; dy <= 4; dy++) {
        for (let dx = -4; dx <= 4; dx++) {
          const ex = p.pos.x + dx, ey = p.pos.y + dy
          if (ex >= 0 && ex < MAP_W && ey >= 0 && ey < MAP_H) {
            p.explored.add(`${ex},${ey}`)
          }
        }
      }

      // Enemy AI
      for (const e of enemiesRef.current) {
        if (!e.alive) continue
        e.moveTimer++
        e.animFrame = (e.animFrame + (e.moveTimer % 30 === 0 ? 1 : 0)) % 2

        if (e.moveTimer >= (e.type === 'bat' ? 20 : e.type === 'boss' ? 30 : 40)) {
          e.moveTimer = 0
          const dist = Math.abs(e.x - p.pos.x) + Math.abs(e.y - p.pos.y)

          if (dist <= 1) {
            // Attack player
            enemyAttack(e)
          } else if (dist <= 6) {
            // Chase player
            const dx = Math.sign(p.pos.x - e.x)
            const dy = Math.sign(p.pos.y - e.y)
            const moveX = Math.random() < 0.6 ? dx : 0
            const moveY = moveX === 0 ? dy : 0
            const nx = e.x + moveX
            const ny = e.y + moveY
            if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H) {
              const tile = mapRef.current[ny][nx]
              const blocked = enemiesRef.current.some(oe => oe.alive && oe.id !== e.id && oe.x === nx && oe.y === ny)
              if ((tile === T.FLOOR || tile === T.TRAP) && !blocked && !(nx === p.pos.x && ny === p.pos.y)) {
                e.x = nx
                e.y = ny
              }
            }
          } else {
            // Random wander
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]]
            const dir = dirs[Math.floor(Math.random() * 4)]
            const nx = e.x + dir[0], ny = e.y + dir[1]
            if (nx >= 0 && nx < MAP_W && ny >= 0 && ny < MAP_H) {
              const tile = mapRef.current[ny][nx]
              if (tile === T.FLOOR || tile === T.TRAP) {
                e.x = nx
                e.y = ny
              }
            }
          }
        }
      }

      // Update floating texts
      floatsRef.current = floatsRef.current.filter(f => { f.life--; f.y -= 0.5; return f.life > 0 })
      // Update particles
      particlesRef.current = particlesRef.current.filter(pt => { pt.life--; pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.1; return pt.life > 0 })
    }

    const render = () => {
      const p = playerRef.current
      ctx!.fillStyle = '#0a0a0f'
      ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Camera offset
      const camX = Math.max(0, Math.min(p.pos.x * TILE - CANVAS_W / 2 + TILE / 2, MAP_W * TILE - CANVAS_W))
      const camY = Math.max(0, Math.min(p.pos.y * TILE - CANVAS_H / 2 + TILE / 2, MAP_H * TILE - CANVAS_H))

      // Draw tiles
      const startTX = Math.floor(camX / TILE)
      const startTY = Math.floor(camY / TILE)

      for (let ty = startTY; ty < startTY + VIEW_TILES_Y; ty++) {
        for (let tx = startTX; tx < startTX + VIEW_TILES_X; tx++) {
          if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) continue
          const sx = tx * TILE - camX
          const sy = ty * TILE - camY

          // Fog of war
          const visible = Math.abs(tx - p.pos.x) <= 4 && Math.abs(ty - p.pos.y) <= 4
          const explored = p.explored.has(`${tx},${ty}`)

          if (!explored) continue

          const tile = mapRef.current[ty][tx]

          // Floor
          if (tile === T.FLOOR || tile === T.POTION || tile === T.TRAP || tile === T.STAIRS) {
            ctx!.fillStyle = (tx + ty) % 2 === 0 ? C.floor1 : C.floor2
            ctx!.fillRect(sx, sy, TILE, TILE)
            // Floor details
            if ((tx * 7 + ty * 13) % 17 === 0) {
              ctx!.fillStyle = 'rgba(255,255,255,0.03)'
              ctx!.fillRect(sx + 4, sy + 4, 3, 3)
            }
          }

          // Wall
          if (tile === T.WALL) {
            ctx!.fillStyle = C.wall1
            ctx!.fillRect(sx, sy, TILE, TILE)
            ctx!.fillStyle = C.wall2
            ctx!.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 8)
            ctx!.fillStyle = C.wall3
            ctx!.fillRect(sx + 2, sy + 2, TILE - 4, 4)
            // Brick pattern
            ctx!.strokeStyle = C.wall2
            ctx!.lineWidth = 1
            ctx!.beginPath()
            ctx!.moveTo(sx + TILE / 2, sy + 2); ctx!.lineTo(sx + TILE / 2, sy + 12)
            ctx!.moveTo(sx + 2, sy + 12); ctx!.lineTo(sx + TILE - 2, sy + 12)
            ctx!.moveTo(sx + TILE / 4, sy + 22); ctx!.lineTo(sx + TILE / 4, sy + 30)
            ctx!.stroke()
          }

          // Door
          if (tile === T.DOOR) {
            ctx!.fillStyle = C.floor1
            ctx!.fillRect(sx, sy, TILE, TILE)
            ctx!.fillStyle = C.door
            ctx!.fillRect(sx + 4, sy + 2, TILE - 8, TILE - 2)
            ctx!.fillStyle = C.doorFrame
            ctx!.fillRect(sx + 4, sy, TILE - 8, 4)
            ctx!.fillStyle = C.gold
            ctx!.fillRect(sx + TILE - 12, sy + TILE / 2 - 2, 4, 4)
          }

          // Stairs
          if (tile === T.STAIRS) {
            ctx!.fillStyle = C.floor1
            ctx!.fillRect(sx, sy, TILE, TILE)
            for (let si = 0; si < 4; si++) {
              ctx!.fillStyle = si % 2 === 0 ? C.stairs : C.stairsDark
              ctx!.fillRect(sx + si * 4, sy + si * 6, TILE - si * 8, 6)
            }
          }

          // Chest
          if (tile === T.CHEST) {
            ctx!.fillStyle = C.floor1
            ctx!.fillRect(sx, sy, TILE, TILE)
            ctx!.fillStyle = C.chest
            ctx!.fillRect(sx + 4, sy + 10, TILE - 8, TILE - 14)
            ctx!.fillStyle = C.chestLid
            ctx!.fillRect(sx + 2, sy + 8, TILE - 4, 8)
            ctx!.fillStyle = C.gold
            ctx!.fillRect(sx + TILE / 2 - 3, sy + 14, 6, 4)
          }

          // Potion
          if (tile === T.POTION) {
            ctx!.fillStyle = C.floor1
            ctx!.fillRect(sx, sy, TILE, TILE)
            // Bottle
            ctx!.fillStyle = C.potionGlass
            ctx!.fillRect(sx + 10, sy + 6, 12, 6)
            ctx!.fillStyle = C.potion
            ctx!.fillRect(sx + 10, sy + 12, 12, 16)
            ctx!.fillStyle = C.potionShine
            ctx!.fillRect(sx + 12, sy + 14, 4, 4)
          }

          // Trap (subtle)
          if (tile === T.TRAP) {
            ctx!.fillStyle = 'rgba(255,0,0,0.15)'
            ctx!.fillRect(sx + 4, sy + 12, TILE - 8, 8)
            for (let si = 0; si < 3; si++) {
              ctx!.fillStyle = C.spike
              ctx!.fillRect(sx + 8 + si * 8, sy + 10, 4, 6)
            }
          }

          // Darkness overlay for non-visible explored
          if (!visible) {
            ctx!.fillStyle = C.fog
            ctx!.fillRect(sx, sy, TILE, TILE)
          }
        }
      }

      // Torch lights
      for (let ty = startTY; ty < startTY + VIEW_TILES_Y; ty++) {
        for (let tx = startTX; tx < startTX + VIEW_TILES_X; tx++) {
          if (tx < 0 || tx >= MAP_W || ty < 0 || ty >= MAP_H) continue
          if ((tx * 11 + ty * 7) % 23 === 0 && mapRef.current[ty][tx] === T.WALL) {
            const sx = tx * TILE - camX
            const sy = ty * TILE - camY
            const flicker = Math.sin(gameTimeRef.current * 0.1 + tx) * 0.05
            const grad = ctx!.createRadialGradient(sx + TILE / 2, sy + TILE / 2, 0, sx + TILE / 2, sy + TILE / 2, TILE * 2)
            grad.addColorStop(0, `rgba(255,152,0,${0.1 + flicker})`)
            grad.addColorStop(1, 'rgba(255,152,0,0)')
            ctx!.fillStyle = grad
            ctx!.fillRect(sx - TILE * 2, sy - TILE * 2, TILE * 5, TILE * 5)
          }
        }
      }

      // Draw enemies
      for (const e of enemiesRef.current) {
        if (!e.alive) continue
        const visible = Math.abs(e.x - p.pos.x) <= 4 && Math.abs(e.y - p.pos.y) <= 4
        if (!visible) continue

        const sx = e.x * TILE - camX
        const sy = e.y * TILE - camY
        const ps = TILE / 8 // pixel size

        // Shadow
        ctx!.fillStyle = C.shadow
        ctx!.fillRect(sx + 4, sy + TILE - 6, TILE - 8, 4)

        // Bob animation
        const bob = Math.sin(gameTimeRef.current * 0.08 + e.x) * 2

        if (e.type === 'slime') {
          drawPixelChar(ctx!, sx + 4, sy + 4 + bob, ps, [C.slime, C.slimeDark, C.slimeEye], SLIME_SPRITE)
        } else if (e.type === 'skeleton') {
          drawPixelChar(ctx!, sx + 4, sy + 2 + bob, ps, [C.skeleton, C.skeletonDark, C.skeletonEye], SKELETON_SPRITE)
        } else if (e.type === 'bat') {
          const wingOff = Math.sin(gameTimeRef.current * 0.2) * 3
          drawPixelChar(ctx!, sx + 4, sy + 4 + wingOff, ps, [C.bat, C.batWing, C.batEye], BAT_SPRITE)
        } else if (e.type === 'boss') {
          drawPixelChar(ctx!, sx, sy + bob, ps, [C.boss, C.bossDark, C.bossEye, C.damage], BOSS_SPRITE)
        }

        // HP bar
        const hpPct = e.hp / e.maxHp
        ctx!.fillStyle = C.hpBg
        ctx!.fillRect(sx + 2, sy - 6, TILE - 4, 4)
        ctx!.fillStyle = hpPct > 0.5 ? C.xpBar : hpPct > 0.25 ? C.torch : C.hpBar
        ctx!.fillRect(sx + 2, sy - 6, (TILE - 4) * hpPct, 4)
      }

      // Draw player
      {
        const sx = p.pos.x * TILE - camX
        const sy = p.pos.y * TILE - camY
        const ps = TILE / 8

        // Shadow
        ctx!.fillStyle = C.shadow
        ctx!.fillRect(sx + 4, sy + TILE - 6, TILE - 8, 4)

        // Player sprite
        const heroColors = [C.hero, C.heroSkin, C.heroHair, C.heroArmor, C.heroCape, C.heroDark]
        drawPixelChar(ctx!, sx + 4, sy + 2, ps, heroColors, HERO_SPRITE)

        // Attack animation
        if (p.isAttacking) {
          ctx!.fillStyle = 'rgba(255,255,100,0.6)'
          const atkX = p.direction === 3 ? sx + TILE : p.direction === 1 ? sx - TILE / 2 : sx + TILE / 4
          const atkY = p.direction === 0 ? sy + TILE : p.direction === 2 ? sy - TILE / 2 : sy + TILE / 4
          ctx!.fillRect(atkX, atkY, TILE / 2, TILE / 2)
          // Sword slash
          ctx!.strokeStyle = 'rgba(255,255,200,0.8)'
          ctx!.lineWidth = 2
          ctx!.beginPath()
          ctx!.arc(sx + TILE / 2, sy + TILE / 2, TILE * 0.8, 0, Math.PI * 1.5)
          ctx!.stroke()
        }

        // Torch glow around player
        const flicker = Math.sin(gameTimeRef.current * 0.15) * 0.03
        const grad = ctx!.createRadialGradient(sx + TILE / 2, sy + TILE / 2, TILE, sx + TILE / 2, sy + TILE / 2, TILE * 4)
        grad.addColorStop(0, `rgba(255,200,100,${0.08 + flicker})`)
        grad.addColorStop(1, 'rgba(255,200,100,0)')
        ctx!.fillStyle = grad
        ctx!.fillRect(sx - TILE * 4, sy - TILE * 4, TILE * 9, TILE * 9)
      }

      // Draw particles
      for (const pt of particlesRef.current) {
        const sx = pt.x - camX
        const sy = pt.y - camY
        ctx!.fillStyle = pt.color
        ctx!.globalAlpha = pt.life / 40
        ctx!.fillRect(sx - pt.size / 2, sy - pt.size / 2, pt.size, pt.size)
      }
      ctx!.globalAlpha = 1

      // Draw floating texts
      for (const f of floatsRef.current) {
        const sx = f.x * TILE - camX + TILE / 2
        const sy = f.y * TILE - camY
        ctx!.font = 'bold 14px monospace'
        ctx!.textAlign = 'center'
        ctx!.fillStyle = f.color
        ctx!.globalAlpha = f.life / f.maxLife
        ctx!.fillText(f.text, sx, sy - (f.maxLife - f.life) * 0.8)
      }
      ctx!.globalAlpha = 1

      // Minimap
      const mmSize = 100
      const mmX = CANVAS_W - mmSize - 10
      const mmY = 10
      const mmScale = mmSize / Math.max(MAP_W, MAP_H)
      ctx!.fillStyle = 'rgba(0,0,0,0.6)'
      ctx!.fillRect(mmX - 2, mmY - 2, mmSize + 4, mmSize + 4)
      for (let my = 0; my < MAP_H; my++) {
        for (let mx = 0; mx < MAP_W; mx++) {
          if (!p.explored.has(`${mx},${my}`)) continue
          const tile = mapRef.current[my][mx]
          if (tile === T.WALL) ctx!.fillStyle = '#3a3a4e'
          else if (tile === T.STAIRS) ctx!.fillStyle = C.stairs
          else ctx!.fillStyle = '#1a1a2e'
          ctx!.fillRect(mmX + mx * mmScale, mmY + my * mmScale, Math.max(mmScale, 1), Math.max(mmScale, 1))
        }
      }
      // Player on minimap
      ctx!.fillStyle = C.hero
      ctx!.fillRect(mmX + p.pos.x * mmScale - 1, mmY + p.pos.y * mmScale - 1, 3, 3)
      // Enemies on minimap
      for (const e of enemiesRef.current) {
        if (!e.alive || !p.explored.has(`${e.x},${e.y}`)) continue
        ctx!.fillStyle = e.type === 'boss' ? C.boss : C.hpBar
        ctx!.fillRect(mmX + e.x * mmScale, mmY + e.y * mmScale, 2, 2)
      }
    }

    const gameLoop = () => {
      frameRef.current++
      update()
      render()
      animId = requestAnimationFrame(gameLoop)
    }

    animId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animId)
  }, [gameState, tryMove, addLog, addFloat, enemyAttack])

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D', '1', '2', '3', '4', '5'].includes(e.key)) {
        e.preventDefault()
        keysRef.current.add(e.key)
      }
      if (e.key === 'Enter' && gameState === 'title') {
        initFloor(1)
        setGameState('playing')
        addLog('🗡️ Bắt đầu phiêu lưu!', C.textYellow)
        addLog('WASD/Phiím mũi tên: Di chuyển', C.textGray)
        addLog('1-5: Dùng bình thuốc', C.textGray)
      }
      if (e.key === 'Enter' && (gameState === 'dead' || gameState === 'win')) {
        // Reset
        playerRef.current = {
          pos: { x: 5, y: 5 }, stats: { hp: 100, maxHp: 100, mp: 30, maxMp: 30, atk: 10, def: 5, spd: 5, xp: 0, xpNext: 50, level: 1, gold: 0 },
          inventory: [], direction: 0, animFrame: 0, moveCD: 0, attackCD: 0, isAttacking: false, keys: 0, floor: 1, explored: new Set<string>()
        }
        setInventory([])
        setPlayerStats(playerRef.current.stats)
        initFloor(1)
        setGameState('playing')
        addLog('🗡️ Bắt đầu lại phiêu lưu!', C.textYellow)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameState, initFloor, addLog])

  // Title screen render
  useEffect(() => {
    if (gameState !== 'title' && gameState !== 'dead' && gameState !== 'win') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const renderTitle = () => {
      ctx!.fillStyle = '#0a0a0f'
      ctx!.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Animated background
      const t = Date.now() * 0.001
      for (let i = 0; i < 50; i++) {
        const px = (Math.sin(t * 0.3 + i * 0.7) * 0.5 + 0.5) * CANVAS_W
        const py = (Math.cos(t * 0.2 + i * 0.5) * 0.5 + 0.5) * CANVAS_H
        ctx!.fillStyle = `rgba(200,168,78,${0.1 + Math.sin(t + i) * 0.05})`
        ctx!.fillRect(px, py, 3, 3)
      }

      // Title
      ctx!.textAlign = 'center'
      ctx!.font = 'bold 36px monospace'
      ctx!.fillStyle = C.textYellow
      ctx!.fillText('⚔️ HẦM NGỤC PIXEL ⚔️', CANVAS_W / 2, 180)

      ctx!.font = '16px monospace'
      ctx!.fillStyle = C.textGray
      ctx!.fillText('Pixel Dungeon RPG', CANVAS_W / 2, 220)

      if (gameState === 'title') {
        // Draw a hero
        const hps = 6
        drawPixelChar(ctx!, CANVAS_W / 2 - 24, 260, hps, [C.hero, C.heroSkin, C.heroHair, C.heroArmor, C.heroCape, C.heroDark], HERO_SPRITE)
        // Slime
        drawPixelChar(ctx!, CANVAS_W / 2 - 80, 270, hps, [C.slime, C.slimeDark, C.slimeEye], SLIME_SPRITE)
        // Skeleton
        drawPixelChar(ctx!, CANVAS_W / 2 + 40, 265, hps, [C.skeleton, C.skeletonDark, C.skeletonEye], SKELETON_SPRITE)

        ctx!.font = '14px monospace'
        ctx!.fillStyle = C.textWhite
        const blink = Math.sin(t * 3) > 0
        if (blink) ctx!.fillText('Nhấn ENTER để bắt đầu', CANVAS_W / 2, 360)

        ctx!.font = '12px monospace'
        ctx!.fillStyle = C.textGray
        ctx!.fillText('WASD / Phím mũi tên: Di chuyển & Tấn công', CANVAS_W / 2, 420)
        ctx!.fillText('1-5: Dùng bình thuốc  |  Mục tiêu: Chinh phục 10 tầng', CANVAS_W / 2, 445)
        ctx!.fillText('Đánh quái → Lên cấp → Thu thập vật phẩm → Vượt hầm ngục', CANVAS_W / 2, 470)
      } else if (gameState === 'dead') {
        ctx!.font = 'bold 28px monospace'
        ctx!.fillStyle = C.damage
        ctx!.fillText('💀 BẠN ĐÃ CHẾT 💀', CANVAS_W / 2, 280)
        ctx!.font = '16px monospace'
        ctx!.fillStyle = C.textGray
        ctx!.fillText(`Tầng đạt được: ${currentFloor}  |  Cấp: ${playerStats.level}  |  Vàng: ${playerStats.gold}`, CANVAS_W / 2, 330)
        const blink = Math.sin(t * 3) > 0
        if (blink) {
          ctx!.fillStyle = C.textWhite
          ctx!.fillText('Nhấn ENTER để chơi lại', CANVAS_W / 2, 380)
        }
      } else if (gameState === 'win') {
        ctx!.font = 'bold 28px monospace'
        ctx!.fillStyle = C.textYellow
        ctx!.fillText('🏆 CHIẾN THẮNG! 🏆', CANVAS_W / 2, 280)
        ctx!.font = '16px monospace'
        ctx!.fillStyle = C.textWhite
        ctx!.fillText('Bạn đã chinh phục Hầm Ngục Pixel!', CANVAS_W / 2, 320)
        ctx!.fillStyle = C.textGray
        ctx!.fillText(`Cấp: ${playerStats.level}  |  Vàng: ${playerStats.gold}`, CANVAS_W / 2, 355)
        const blink = Math.sin(t * 3) > 0
        if (blink) {
          ctx!.fillStyle = C.textWhite
          ctx!.fillText('Nhấn ENTER để chơi lại', CANVAS_W / 2, 400)
        }
      }

      animId = requestAnimationFrame(renderTitle)
    }
    animId = requestAnimationFrame(renderTitle)
    return () => cancelAnimationFrame(animId)
  }, [gameState, currentFloor, playerStats])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-2 select-none">
      {/* Game Canvas */}
      <div className="relative border-2 border-[#2a2a3e] rounded-lg overflow-hidden shadow-[0_0_30px_rgba(200,168,78,0.2)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="block"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* HUD Overlay - Top */}
        {gameState === 'playing' && (
          <div className="absolute top-2 left-2 flex flex-col gap-1" style={{ pointerEvents: 'none' }}>
            <div className="bg-black/70 rounded px-2 py-1 text-xs font-mono">
              <span className="text-[#c8a84e] font-bold">Tầng {currentFloor}</span>
              <span className="text-[#888] ml-2">Lv.{playerStats.level}</span>
            </div>
            {/* HP Bar */}
            <div className="bg-black/70 rounded px-2 py-1">
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-[#e74c3c]">HP</span>
                <div className="w-32 h-3 bg-[#3a0000] rounded-sm overflow-hidden">
                  <div className="h-full bg-[#e74c3c] transition-all duration-300" style={{ width: `${Math.max(0, playerStats.hp / playerStats.maxHp * 100)}%` }} />
                </div>
                <span className="text-[#e74c3c]">{playerStats.hp}/{playerStats.maxHp}</span>
              </div>
            </div>
            {/* MP Bar */}
            <div className="bg-black/70 rounded px-2 py-1">
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-[#2196f3]">MP</span>
                <div className="w-32 h-3 bg-[#001a3a] rounded-sm overflow-hidden">
                  <div className="h-full bg-[#2196f3] transition-all duration-300" style={{ width: `${Math.max(0, playerStats.mp / playerStats.maxMp * 100)}%` }} />
                </div>
                <span className="text-[#2196f3]">{playerStats.mp}/{playerStats.maxMp}</span>
              </div>
            </div>
            {/* XP Bar */}
            <div className="bg-black/70 rounded px-2 py-1">
              <div className="flex items-center gap-1 text-xs font-mono">
                <span className="text-[#4caf50]">XP</span>
                <div className="w-32 h-3 bg-[#003a00] rounded-sm overflow-hidden">
                  <div className="h-full bg-[#4caf50] transition-all duration-300" style={{ width: `${playerStats.xpNext > 0 ? playerStats.xp / playerStats.xpNext * 100 : 0}%` }} />
                </div>
                <span className="text-[#4caf50]">{playerStats.xp}/{playerStats.xpNext}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats - Top Right */}
        {gameState === 'playing' && (
          <div className="absolute top-2 right-[120px] bg-black/70 rounded px-2 py-1 text-xs font-mono" style={{ pointerEvents: 'none' }}>
            <div className="text-[#ff9800]">⚔️ ATK: {playerStats.atk}</div>
            <div className="text-[#2196f3]">🛡️ DEF: {playerStats.def}</div>
            <div className="text-[#ffd700]">💰 {playerStats.gold}G</div>
            <div className="text-[#ffd700]">🔑 {playerKeys}</div>
          </div>
        )}
      </div>

      {/* Bottom panel: Inventory + Log */}
      {gameState === 'playing' && (
        <div className="w-[800px] mt-2 flex gap-2">
          {/* Inventory */}
          <div className="bg-[#12121a] border border-[#2a2a3e] rounded-lg p-2 w-[200px]">
            <div className="text-[#c8a84e] text-xs font-mono font-bold mb-1">🎒 Túi đồ ({inventory.length})</div>
            <div className="max-h-[120px] overflow-y-auto space-y-1">
              {inventory.length === 0 && <div className="text-[#555] text-xs font-mono">Trống</div>}
              {inventory.map((item, i) => (
                <div key={i} className="text-xs font-mono flex items-center gap-1">
                  <span>{item.icon}</span>
                  <span className="text-[#aaa]">{item.name}</span>
                  <span className="text-[#555] text-[10px]">[{i + 1}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Game Log */}
          <div className="bg-[#12121a] border border-[#2a2a3e] rounded-lg p-2 flex-1">
            <div className="text-[#c8a84e] text-xs font-mono font-bold mb-1">📜 Nhật ký</div>
            <div className="max-h-[120px] overflow-y-auto space-y-0.5">
              {logs.slice(-8).map((log, i) => (
                <div key={i} className="text-xs font-mono" style={{ color: log.color }}>{log.text}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Controls */}
      {gameState === 'playing' && (
        <div className="w-[800px] mt-2 flex justify-center gap-4 md:hidden">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button className="bg-[#2a2a3e] text-white w-12 h-12 rounded text-lg active:bg-[#4a4a5e]" onTouchStart={() => { keysRef.current.add('w') }} onTouchEnd={() => { keysRef.current.delete('w') }}>▲</button>
            <div />
            <button className="bg-[#2a2a3e] text-white w-12 h-12 rounded text-lg active:bg-[#4a4a5e]" onTouchStart={() => { keysRef.current.add('a') }} onTouchEnd={() => { keysRef.current.delete('a') }}>◄</button>
            <button className="bg-[#2a2a3e] text-white w-12 h-12 rounded text-lg active:bg-[#4a4a5e]" onTouchStart={() => { keysRef.current.add('s') }} onTouchEnd={() => { keysRef.current.delete('s') }}>▼</button>
            <button className="bg-[#2a2a3e] text-white w-12 h-12 rounded text-lg active:bg-[#4a4a5e]" onTouchStart={() => { keysRef.current.add('d') }} onTouchEnd={() => { keysRef.current.delete('d') }}>►</button>
          </div>
        </div>
      )}
    </div>
  )
}
