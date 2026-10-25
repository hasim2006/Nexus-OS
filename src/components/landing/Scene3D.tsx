import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const AGENTS = [
  "Strategy AI",
  "Content AI",
  "SEO AI",
  "Ads AI",
  "Social AI",
  "Analytics AI",
  "Email AI",
  "CRM AI",
  "Leads AI",
  "Automation AI",
  "Brand AI",
  "Video AI",
];

const PURPLE = new THREE.Color("#FF7A00"); // primary orange
const BLUE = new THREE.Color("#FFFFFF"); // pure white
const CYAN = new THREE.Color("#FFB37A"); // soft orange-white

function CoreCube() {
  const cubeGroupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (cubeGroupRef.current) {
      cubeGroupRef.current.rotation.x = t * 0.25;
      cubeGroupRef.current.rotation.y = t * 0.35;
      cubeGroupRef.current.position.y = Math.sin(t * 0.6) * 0.15;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.04;
      glowRef.current.scale.setScalar(s);
    }
  });
  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.7, 32, 32]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.08} />
      </mesh>
      <group ref={cubeGroupRef}>
        <mesh>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial
            color="#0b0b14"
            emissive={PURPLE}
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[1.61, 1.61, 1.61]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.25} />
        </mesh>
      </group>
      <pointLight color={PURPLE} intensity={4} distance={12} />
    </group>
  );
}

function AgentCube({ index, total, label }: { index: number; total: number; label: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  const { radius, baseAngle, yOff, speed, color, size, phase } = useMemo(() => {
    const layer = index % 3;
    const radius = 4 + layer * 1.4;
    const baseAngle = (index / total) * Math.PI * 2;
    const yOff = ((index % 5) - 2) * 0.8;
    const speed = 0.08 + (index % 4) * 0.025;
    const colors = [PURPLE, BLUE, CYAN];
    const color = colors[index % 3];
    const size = 0.45 + ((index * 7) % 5) * 0.05;
    const phase = (index * 1.3) % (Math.PI * 2);
    return { radius, baseAngle, yOff, speed, color, size, phase };
  }, [index, total]);

  const lineGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const a = baseAngle + t * speed;
    const x = Math.cos(a) * radius;
    const z = Math.sin(a) * radius;
    const y = yOff + Math.sin(t * 0.8 + phase) * 0.3;
    if (ref.current) {
      ref.current.position.set(x, y, z);
      ref.current.rotation.x = t * (0.3 + (index % 3) * 0.1);
      ref.current.rotation.y = t * (0.25 + (index % 4) * 0.08);
    }
    if (lineRef.current) {
      const pos = lineRef.current.geometry.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, 0, 0, 0);
      pos.setXYZ(1, x, y, z);
      pos.needsUpdate = true;
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.15 + (Math.sin(t * 2 + phase) * 0.5 + 0.5) * 0.35;
    }
    if (particleRef.current) {
      const k = Math.sin(t * 1.2 + phase) * 0.5 + 0.5;
      particleRef.current.position.set(x * k, y * k, z * k);
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial
          color="#0a0a14"
          emissive={color}
          emissiveIntensity={0.9}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
      {/* @ts-expect-error r3f line */}
      <line ref={lineRef as never} geometry={lineGeom}>
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </line>
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* hidden label data for parent overlay if needed */}
      <group userData={{ label }} />
    </group>
  );
}

function BackgroundCubes({ count = 200 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60 - 10,
      ),
      rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      speed: 0.05 + Math.random() * 0.15,
      scale: 0.05 + Math.random() * 0.18,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    data.forEach((d, i) => {
      dummy.position.set(
        d.pos.x + Math.sin(t * d.speed + i) * 0.4,
        d.pos.y + Math.cos(t * d.speed + i) * 0.4,
        d.pos.z,
      );
      dummy.rotation.set(d.rot.x + t * d.speed, d.rot.y + t * d.speed * 0.7, d.rot.z);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#1a0e05"
        emissive={BLUE}
        emissiveIntensity={0.4}
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  );
}

function Particles({ count = 400 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      speeds[i] = 0.1 + Math.random() * 0.4;
    }
    return { positions, speeds };
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * 0.3;
      if (arr[i * 3 + 1] > 12) arr[i * 3 + 1] = -12;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        color={CYAN}
        size={0.04}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Grid() {
  const ref = useRef<THREE.GridHelper>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime();
      (ref.current.material as THREE.Material & { opacity: number }).opacity =
        0.15 + Math.sin(t * 0.5) * 0.05;
    }
  });
  return <gridHelper ref={ref} args={[80, 80, "#FF7A00", "#1a0a02"]} position={[0, -6, 0]} />;
}

function CameraRig() {
  useFrame(({ camera, clock, pointer }) => {
    const t = clock.getElapsedTime();
    const targetX = Math.sin(t * 0.15) * 2.5 + pointer.x * 1.5;
    const targetY = Math.cos(t * 0.12) * 1.2 + pointer.y * 0.8;
    const targetZ = 11 + Math.sin(t * 0.1) * 1.5;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.position.z += (targetZ - camera.position.z) * 0.02;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], fov: 55 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={["#040404", 10, 34]} />
      <hemisphereLight args={["#FF9A40", "#000000", 0.18]} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 8, 5]} color={BLUE} intensity={1.4} distance={28} />
      <pointLight position={[-10, -5, 5]} color={PURPLE} intensity={1.6} distance={28} />
      <pointLight position={[0, 0, -10]} color={CYAN} intensity={1.0} distance={24} />

      <CameraRig />
      <CoreCube />
      {AGENTS.map((label, i) => (
        <AgentCube key={label} index={i} total={AGENTS.length} label={label} />
      ))}
      <BackgroundCubes count={90} />
      <Particles count={180} />
      <Grid />

      <EffectComposer multisampling={0}>
        <Bloom intensity={1.0} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.95} />
      </EffectComposer>
    </Canvas>
  );
}
