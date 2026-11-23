import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type GravityPaletteId =
  | 'autoMorph'
  | 'roseGold'
  | 'pinkBlush'
  | 'voltLime'
  | 'arcticBlue';

export interface GravityPaletteSpec {
  id: Exclude<GravityPaletteId, 'autoMorph'>;
  name: string;
  accentColor: string;
  bgGradient: string;
  pastel: string;
  light: string;
  medium: string;
  deep: string;
  glass: string;
}

export const GRAVITY_PALETTES: Record<
  Exclude<GravityPaletteId, 'autoMorph'>,
  GravityPaletteSpec
> = {
  roseGold: {
    id: 'roseGold',
    name: 'Royal Blue & Pearl',
    accentColor: '#2F69FF',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #ecefff 35%, #c2d1ff 100%)',
    pastel: '#ECEFFF',
    light: '#A8C1FF',
    medium: '#2F69FF',
    deep: '#0A33BF',
    glass: '#4D80FF',
  },
  voltLime: {
    id: 'voltLime',
    name: 'Volt Lime & Slate',
    accentColor: '#E1FC03',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #fbffe5 38%, #e8ff9c 100%)',
    pastel: '#FBFFE2',
    light: '#EFFE69',
    medium: '#E1FC03',
    deep: '#B1E200',
    glass: '#DCFF32',
  },
  pinkBlush: {
    id: 'pinkBlush',
    name: 'Rose Blush & Crème',
    accentColor: '#FFC5C2',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #fff0f1 38%, #ffd1d5 100%)',
    pastel: '#FFF5F4',
    light: '#FFECEB',
    medium: '#FFA6B3',
    deep: '#FF4D6D',
    glass: '#FFA6B3',
  },
  arcticBlue: {
    id: 'arcticBlue',
    name: 'Arctic Sky & Crystal',
    accentColor: '#96E5FF',
    bgGradient: 'radial-gradient(circle at center, #ffffff 0%, #effaff 38%, #c9f1ff 100%)',
    pastel: '#F0F9FF',
    light: '#C9F1FF',
    medium: '#96E5FF',
    deep: '#2BA5FF',
    glass: '#98E4FF',
  },
};

const AUTO_MORPH_SEQUENCE: Array<Exclude<GravityPaletteId, 'autoMorph'>> = [
  'roseGold',
  'voltLime',
  'pinkBlush',
  'arcticBlue',
];

/**
 * Trả về bộ màu + gradient nền tương ứng với chế độ GRAVITY và trang/slide hiện tại.
 * - Khi chọn 'autoMorph': chuyển sắc qua 4 giai đoạn (Royal Blue -> Volt Lime -> Rose Blush -> Arctic Blue).
 * - Khi chọn 1 palette cố định + morphOnPageChange: giữ tông màu chính nhưng điều biến điểm sáng
 *   & sắc thái nhẹ theo trang để hiệu ứng qua trang luôn sinh động.
 */
export function resolveGravityStage(
  paletteId: GravityPaletteId,
  pageIndex: number,
  slideIndex: number,
  morphOnPageChange: boolean
): {
  palette: GravityPaletteSpec;
  bgGradient: string;
  stageIndex: number;
} {
  const step = Math.max(0, pageIndex + slideIndex);
  if (paletteId === 'autoMorph') {
    const stageIdx = step % AUTO_MORPH_SEQUENCE.length;
    const key = AUTO_MORPH_SEQUENCE[stageIdx];
    const spec = GRAVITY_PALETTES[key];
    return {
      palette: spec,
      bgGradient: spec.bgGradient,
      stageIndex: stageIdx,
    };
  }

  const baseSpec = GRAVITY_PALETTES[paletteId] || GRAVITY_PALETTES.roseGold;
  if (!morphOnPageChange) {
    return {
      palette: baseSpec,
      bgGradient: baseSpec.bgGradient,
      stageIndex: 0,
    };
  }

  // Khi chuyển trang ở chế độ palette đơn: dịch chuyển tâm ánh sáng radial gradient nhẹ nhàng
  const origins = [
    'circle at 50% 50%',
    'circle at 34% 38%',
    'circle at 68% 42%',
    'circle at 46% 64%',
  ];
  const origin = origins[step % origins.length];
  return {
    palette: baseSpec,
    bgGradient: baseSpec.bgGradient.replace('circle at center', origin),
    stageIndex: step % 4,
  };
}

interface SphereBody {
  id: number;
  radius: number;
  mass: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  meshGroup: THREE.Group;
  sphere: THREE.Mesh;
  material: THREE.MeshPhysicalMaterial;
  role: 'pastel' | 'light' | 'medium' | 'deep' | 'glass';
  isGlass: boolean;
  visualScale: number;
  shapeTarget: THREE.Vector3;
}

interface ColorSet {
  pastel: THREE.Color;
  light: THREE.Color;
  medium: THREE.Color;
  deep: THREE.Color;
  glass: THREE.Color;
}

function createColorSet(spec: GravityPaletteSpec): ColorSet {
  return {
    pastel: new THREE.Color(spec.pastel),
    light: new THREE.Color(spec.light),
    medium: new THREE.Color(spec.medium),
    deep: new THREE.Color(spec.deep),
    glass: new THREE.Color(spec.glass),
  };
}

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    if (dbg) {
      const r = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '');
      if (/SwiftShader|llvmpipe|Software|Mesa Offscreen/i.test(r)) {
        return true;
      }
    }
    return false;
  } catch {
    return true;
  }
}

export interface GravityBackgroundCanvasProps {
  paletteId: GravityPaletteId;
  pageIndex: number;
  slideIndex: number;
  morphOnPageChange?: boolean;
  isDark?: boolean;
}

export const GravityBackgroundCanvas: React.FC<GravityBackgroundCanvasProps> = ({
  paletteId,
  pageIndex,
  slideIndex,
  morphOnPageChange = false,
  isDark = false,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetStageRef = useRef<{
    palette: GravityPaletteSpec;
    stageIndex: number;
    pageStep: number;
    pulseAt: number;
    formHeart: boolean;
  }>({
    palette: resolveGravityStage(paletteId, pageIndex, slideIndex, morphOnPageChange).palette,
    stageIndex: 0,
    pageStep: pageIndex + slideIndex,
    pulseAt: 0,
    formHeart: false,
  });

  // Cập nhật mục tiêu màu & xung lực chuyển trang mỗi khi người dùng đổi preset hoặc chuyển trang/slide
  useEffect(() => {
    const resolved = resolveGravityStage(paletteId, pageIndex, slideIndex, morphOnPageChange);
    const prevStep = targetStageRef.current.pageStep;
    const nextStep = pageIndex + slideIndex;

    targetStageRef.current.palette = resolved.palette;
    targetStageRef.current.stageIndex = resolved.stageIndex;
    targetStageRef.current.pageStep = nextStep;
    // Kích hoạt nhẹ hiệu ứng xếp tim khi ở stage 2 (Rose Blush / Heart Form) nếu đang AutoMorph
    targetStageRef.current.formHeart = paletteId === 'autoMorph' && resolved.stageIndex === 2;

    if (prevStep !== nextStep) {
      targetStageRef.current.pulseAt = performance.now();
    }
  }, [paletteId, pageIndex, slideIndex, morphOnPageChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const width = Math.max(container.clientWidth || window.innerWidth, 1);
    const height = Math.max(container.clientHeight || window.innerHeight, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 11);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 0.96 : 1.15;
    renderer.shadowMap.enabled = false;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.appendChild(renderer.domElement);

    // Môi trường phản chiếu studio giúp vật liệu thủy tinh & clearcoat sáng trong
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTex.texture;

    const initialColors = createColorSet(targetStageRef.current.palette);
    const curPal: ColorSet = {
      pastel: initialColors.pastel.clone(),
      light: initialColors.light.clone(),
      medium: initialColors.medium.clone(),
      deep: initialColors.deep.clone(),
      glass: initialColors.glass.clone(),
    };
    let targetColors = createColorSet(targetStageRef.current.palette);
    let lastPaletteId = targetStageRef.current.palette.id;

    // 5 nguồn sáng giống thiết kế GRAVITY gốc
    const hemiLight = new THREE.HemisphereLight(
      0xffffff,
      curPal.medium.clone(),
      isDark ? 1.25 : 1.6
    );
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, isDark ? 1.15 : 1.4);
    keyLight.position.set(-6, 10, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.25);
    rimLight.position.set(8, 7, -8);
    scene.add(rimLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 0.4);
    frontLight.position.set(0, 0, 11);
    scene.add(frontLight);

    const sideLight = new THREE.DirectionalLight(0xffffff, 0.3);
    sideLight.position.set(-9, -2, 4);
    scene.add(sideLight);

    let viewportWidth = 10;
    let viewportHeight = 6;
    let shapeScale = 1;
    let meanRadius = 0.45;

    const updateFrustumBounds = () => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      const fov = THREE.MathUtils.degToRad(camera.fov);
      viewportHeight = 2 * Math.tan(fov / 2) * camera.position.z;
      viewportWidth = viewportHeight * (w / h);
    };
    updateFrustumBounds();

    const isMobile = window.innerWidth < 768;
    const sphereCount = isSoftwareGl ? (isMobile ? 28 : 44) : isMobile ? 42 : 76;
    const geometry = new THREE.SphereGeometry(1, isSoftwareGl ? 24 : 40, isSoftwareGl ? 24 : 40);
    const balls: SphereBody[] = [];

    for (let i = 0; i < sphereCount; i++) {
      const r = Math.random();
      let radius = 0.33;
      if (r < 0.3) radius = 0.25 + Math.random() * 0.11;
      else if (r < 0.8) radius = 0.39 + Math.random() * 0.16;
      else radius = 0.6 + Math.random() * 0.19;

      const mass = Math.pow(radius, 3);
      const isGlass = Math.random() < 0.22;

      let role: SphereBody['role'] = 'medium';
      let chosen = curPal.medium;
      let mat: THREE.MeshPhysicalMaterial;

      if (isGlass) {
        role = 'glass';
        chosen = curPal.glass;
        mat = new THREE.MeshPhysicalMaterial({
          color: chosen.clone(),
          roughness: 0.08,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          transmission: isSoftwareGl ? 0 : 0.92,
          ior: 1.485,
          thickness: 2.0,
          specularColor: new THREE.Color('#ffffff'),
          specularIntensity: 1,
          attenuationColor: curPal.pastel.clone(),
          attenuationDistance: 1.1,
          emissive: chosen.clone(),
          emissiveIntensity: 0.12,
          transparent: true,
          opacity: isSoftwareGl ? 0.56 : 1,
        });
      } else {
        const cr = Math.random();
        if (cr < 0.25) {
          chosen = curPal.pastel;
          role = 'pastel';
        } else if (cr < 0.55) {
          chosen = curPal.light;
          role = 'light';
        } else if (cr < 0.85) {
          chosen = curPal.medium;
          role = 'medium';
        } else {
          chosen = curPal.deep;
          role = 'deep';
        }
        mat = new THREE.MeshPhysicalMaterial({
          color: chosen.clone(),
          roughness: 0.44,
          metalness: 0,
          clearcoat: 0.26,
          clearcoatRoughness: 0.34,
          emissive: chosen.clone(),
          emissiveIntensity: 0.08,
          transparent: true,
          opacity: 0.96,
        });
      }

      const group = new THREE.Group();
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.scale.setScalar(radius);
      group.add(mesh);
      scene.add(group);

      balls.push({
        id: i,
        radius,
        mass,
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        meshGroup: group,
        sphere: mesh,
        material: mat,
        role,
        isGlass,
        visualScale: radius,
        shapeTarget: new THREE.Vector3(),
      });
    }

    meanRadius = balls.reduce((sum, b) => sum + b.radius, 0) / balls.length;

    const inHeart = (x: number, y: number) => {
      const a = x * x + y * y - 1;
      return a * a * a - x * x * y * y * y <= 0;
    };

    const assignHeartTargets = () => {
      if (!balls.length) return;
      const S = Math.min(viewportWidth * 0.28, viewportHeight * 0.26);
      const baseCY = -viewportHeight * 0.02;
      shapeScale = Math.max(0.35, Math.min(1, (S * 0.46) / 2.2 / meanRadius));

      for (let i = 0; i < balls.length; i++) {
        let x = 0;
        let y = 0;
        let tries = 0;
        do {
          x = (Math.random() * 2 - 1) * 1.25;
          y = Math.random() * 2.55 - 1.4;
          tries++;
        } while (!inHeart(x, y) && tries < 60);

        balls[i].shapeTarget.set(
          x * S,
          (y + 0.12) * S + baseCY,
          (Math.random() - 0.5) * 0.35
        );
      }
    };
    assignHeartTargets();

    // Khởi tạo vị trí phân bố quanh màn hình và bay tụ vào nhẹ nhàng
    const initScatterRadius = Math.max(viewportWidth, viewportHeight) * 0.85;
    for (const b of balls) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (0.35 + Math.random() * 0.85) * initScatterRadius;
      const px = Math.cos(angle) * dist * 1.1;
      const py = Math.sin(angle) * dist * 0.72;
      const pz = (Math.random() - 0.5) * 2.4;
      b.position.set(px, py, pz);
      b.meshGroup.position.copy(b.position);
      b.velocity
        .set(-px, -py, -pz)
        .normalize()
        .multiplyScalar(0.05 + Math.random() * 0.04);
    }

    // Theo dõi con trỏ chuột (canvas nằm sau UI nên lắng nghe trên window)
    const mousePos = { x: 99, y: 99, isDown: false };
    const mouseProjVec = new THREE.Vector3();
    const mouseWorld3D = new THREE.Vector3();
    const prevMouseWorld = new THREE.Vector3();
    const diffVec = new THREE.Vector3();
    const collideDiff = new THREE.Vector3();
    const relVel = new THREE.Vector3();
    const deltaPos = new THREE.Vector3();
    const rotAxis = new THREE.Vector3();

    const handlePointerMove = (e: PointerEvent) => {
      mousePos.x = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      mousePos.y = -(e.clientY / Math.max(window.innerHeight, 1)) * 2 + 1;
    };
    const handlePointerDown = () => {
      mousePos.isDown = true;
    };
    const handlePointerUp = () => {
      mousePos.isDown = false;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('blur', handlePointerUp);

    const resizeObserver = new ResizeObserver(() => {
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateFrustumBounds();
      assignHeartTargets();
    });
    resizeObserver.observe(container);

    let disposed = false;
    let isVisible = true;
    let rafId = 0;
    let lastPulseHandled = 0;
    let shapeBlend = 0;
    let prevNow = performance.now();
    let elapsed = 0;

    const params = {
      rebound: -0.3,
      mouseRepelForce: 0.042,
      mouseRepelRadius: 4.1,
      centerAttractForce: 0.0032,
      bounciness: 0.02,
    };

    const scheduleNext = () => {
      if (disposed || !isVisible) return;
      rafId = requestAnimationFrame(tick);
    };

    const afterDraw = () => {
      if (disposed || !isVisible) return;
      if (isSoftwareGl) {
        // Giãn nhịp khi chạy software WebGL để không nghẽn UI
        setTimeout(() => {
          if (!disposed && isVisible) {
            rafId = requestAnimationFrame(tick);
          }
        }, 32);
      } else {
        scheduleNext();
      }
    };

    const tick = (now: number) => {
      if (disposed || !isVisible) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - prevNow) / 1000));
      prevNow = now;
      if (!reducedMotion) {
        elapsed += dt;
      }

      // Kiểm tra đổi palette mục tiêu
      const activeStage = targetStageRef.current;
      if (activeStage.palette.id !== lastPaletteId) {
        lastPaletteId = activeStage.palette.id;
        targetColors = createColorSet(activeStage.palette);
      }

      // Nội suy mượt màu của toàn bộ các khối cầu + ánh sáng môi trường
      const colorDamp = 3.2;
      curPal.pastel.lerp(targetColors.pastel, 1 - Math.exp(-colorDamp * dt));
      curPal.light.lerp(targetColors.light, 1 - Math.exp(-colorDamp * dt));
      curPal.medium.lerp(targetColors.medium, 1 - Math.exp(-colorDamp * dt));
      curPal.deep.lerp(targetColors.deep, 1 - Math.exp(-colorDamp * dt));
      curPal.glass.lerp(targetColors.glass, 1 - Math.exp(-colorDamp * dt));
      hemiLight.groundColor.copy(curPal.medium);

      // Xung lực chuyển trang: khi đổi trang hoặc slide, truyền sóng đẩy xoáy nhẹ qua cụm cầu 3D
      if (activeStage.pulseAt > lastPulseHandled && !reducedMotion) {
        lastPulseHandled = activeStage.pulseAt;
        const dirSign = activeStage.stageIndex % 2 === 0 ? 1 : -1;
        for (const b of balls) {
          const angle = Math.atan2(b.position.y, b.position.x) + dirSign * 0.9;
          const impulse = 0.032 + (b.id % 5) * 0.008;
          b.velocity.x += Math.cos(angle) * impulse;
          b.velocity.y += Math.sin(angle) * impulse + 0.015 * dirSign;
          b.velocity.z += ((b.id % 3) - 1) * 0.014;
        }
      }

      // Smooth blend sang dáng trái tim khi AutoMorph ở Stage 2
      const targetShape = activeStage.formHeart ? 1 : 0;
      shapeBlend = THREE.MathUtils.damp(shapeBlend, targetShape, 3.0, dt);

      // Chiếu tọa độ con trỏ xuống mặt phẳng z = 0
      mouseProjVec.set(mousePos.x, mousePos.y, 0.5).unproject(camera);
      const dir = mouseProjVec.sub(camera.position).normalize();
      const distance = -camera.position.z / (Math.abs(dir.z) > 0.0001 ? dir.z : -1);
      mouseWorld3D.copy(camera.position).add(dir.multiplyScalar(distance));

      const interacting =
        !reducedMotion && (Math.abs(mousePos.x) < 0.99 || Math.abs(mousePos.y) < 0.99);
      let mouseSpeed = interacting ? mouseWorld3D.distanceTo(prevMouseWorld) : 0;
      if (mouseSpeed > 2.5) mouseSpeed = 2.5;
      prevMouseWorld.copy(mouseWorld3D);

      const frameScale = dt * 60;
      const damping = Math.pow(THREE.MathUtils.lerp(0.915, 0.9, shapeBlend), frameScale);

      for (const b of balls) {
        if (!reducedMotion) {
          // Bồng bềnh lơ lửng hữu cơ
          const heroWeight = 1 - shapeBlend * 0.7;
          b.velocity.x +=
            Math.sin(elapsed * 0.42 + b.id * 1.5) * 0.00038 * b.radius * heroWeight * frameScale;
          b.velocity.y +=
            Math.cos(elapsed * 0.5 + b.id * 1.2) * 0.00038 * b.radius * heroWeight * frameScale;
          b.velocity.z += Math.sin(elapsed * 0.35 + b.id) * 0.0001 * heroWeight * frameScale;
        }

        // Hút tụ về trung tâm hoặc về dáng trái tim
        const clusterWeight = 1 - shapeBlend;
        if (clusterWeight > 0.01) {
          const cForce = params.centerAttractForce * clusterWeight * frameScale;
          b.velocity.x += -b.position.x * cForce * 0.38;
          b.velocity.y += -b.position.y * cForce * 1.65;
          b.velocity.z += -b.position.z * cForce * 1.6;
        }
        if (shapeBlend > 0.01) {
          const k = 0.055 * shapeBlend * frameScale;
          b.velocity.x += (b.shapeTarget.x - b.position.x) * k;
          b.velocity.y += (b.shapeTarget.y - b.position.y) * k;
          b.velocity.z += (b.shapeTarget.z - b.position.z) * k;
        }

        // Tương tác đẩy nhẹ theo con trỏ chuột
        if (interacting) {
          diffVec.subVectors(b.position, mouseWorld3D);
          const dist = diffVec.length();
          const rad = mousePos.isDown
            ? params.mouseRepelRadius * 1.35
            : params.mouseRepelRadius;
          const force = mousePos.isDown
            ? params.mouseRepelForce * 1.65
            : params.mouseRepelForce;

          if (dist < rad && dist > 0.0001) {
            const ratio = dist / rad;
            const sf = 1 - ratio * ratio * (3 - 2 * ratio);
            const push = sf * force * (1 + mouseSpeed * 2.8) * frameScale;
            diffVec.normalize();
            diffVec.z *= 0.12;
            diffVec.normalize();
            b.velocity.addScaledVector(diffVec, push);
          }
        }

        b.velocity.multiplyScalar(damping);
        b.position.addScaledVector(b.velocity, frameScale);

        // Đồng bộ màu sắc từng khối cầu
        const targetMatColor = b.isGlass ? curPal.glass : curPal[b.role];
        b.material.color.copy(targetMatColor);
        b.material.emissive.copy(targetMatColor);
        if (b.isGlass) {
          b.material.attenuationColor.copy(curPal.pastel);
        }

        const targetScale = b.radius * (1 - (1 - shapeScale) * shapeBlend);
        b.visualScale += (targetScale - b.visualScale) * 0.12;
        b.sphere.scale.setScalar(b.visualScale);
      }

      // Solver va chạm Verlet (3-4 substeps)
      const subSteps = isSoftwareGl ? 2 : 4;
      const collideScale = 0.28 * (1 - 0.9 * shapeBlend);
      for (let step = 0; step < subSteps; step++) {
        for (let i = 0; i < balls.length; i++) {
          const a = balls[i];
          for (let j = i + 1; j < balls.length; j++) {
            const b = balls[j];
            collideDiff.subVectors(b.position, a.position);
            const dist = collideDiff.length();
            const min = a.visualScale + b.visualScale;
            if (dist < min && dist > 0.001) {
              const overlap = min - dist;
              collideDiff.multiplyScalar(1 / dist);
              const total = a.mass + b.mass;
              const r1 = b.mass / total;
              const r2 = a.mass / total;
              a.position.addScaledVector(collideDiff, -overlap * r1 * collideScale);
              b.position.addScaledVector(collideDiff, overlap * r2 * collideScale);

              relVel.subVectors(b.velocity, a.velocity);
              const along = relVel.dot(collideDiff);
              if (along < -0.0001) {
                const impulse =
                  (-(1 + params.bounciness) * along) / (1 / a.mass + 1 / b.mass);
                a.velocity.addScaledVector(collideDiff, -impulse / a.mass);
                b.velocity.addScaledVector(collideDiff, impulse / b.mass);
              }
            }
          }
        }
      }

      // Giới hạn khung nhìn & cập nhật chuyển động xoay
      const xBound = viewportWidth / 2 - 0.15;
      const topY = viewportHeight / 2 - 0.05;
      const floorY = -viewportHeight / 2 + 0.05;
      const zBound = 2.0;

      for (const b of balls) {
        const r = b.visualScale;
        if (b.position.x < -xBound - r) {
          b.position.x = -xBound - r;
          b.velocity.x *= params.rebound;
        } else if (b.position.x > xBound + r) {
          b.position.x = xBound + r;
          b.velocity.x *= params.rebound;
        }

        if (b.position.y - r < floorY) {
          b.position.y = floorY + r;
          if (b.velocity.y < 0) b.velocity.y = -b.velocity.y * 0.35;
        } else if (b.position.y + r > topY) {
          b.position.y = topY - r;
          if (b.velocity.y > 0) b.velocity.y *= params.rebound;
        }

        if (b.position.z < -zBound) {
          b.position.z = -zBound;
          b.velocity.z *= params.rebound;
        } else if (b.position.z > zBound) {
          b.position.z = zBound;
          b.velocity.z *= params.rebound;
        }

        deltaPos.copy(b.position).sub(b.meshGroup.position);
        if (deltaPos.lengthSq() > 0.000001) {
          rotAxis.set(deltaPos.y, -deltaPos.x, 0).normalize();
          b.meshGroup.rotateOnWorldAxis(rotAxis, (deltaPos.length() / b.radius) * 0.95);
        }
        b.meshGroup.position.copy(b.position);
      }

      renderer.render(scene, camera);
      afterDraw();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        isVisible = false;
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else if (!disposed) {
        isVisible = true;
        prevNow = performance.now();
        scheduleNext();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Khởi động loop
    scheduleNext();

    return () => {
      disposed = true;
      isVisible = false;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handlePointerUp);
      resizeObserver.disconnect();

      balls.forEach((b) => {
        b.material.dispose();
        scene.remove(b.meshGroup);
      });
      geometry.dispose();
      envTex.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      id="gravity-webgl-background"
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
