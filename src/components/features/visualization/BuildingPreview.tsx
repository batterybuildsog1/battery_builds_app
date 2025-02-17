import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF } from '@react-three/drei';

interface BuildingPreviewProps {
  modelUrl?: string;
  className?: string;
}

const DefaultBuilding: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#64748b" />
    </mesh>
  );
};

const ModelLoader: React.FC<{ url: string }> = ({ url }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

const BuildingPreview: React.FC<BuildingPreviewProps> = ({ 
  modelUrl,
  className = "w-full h-[400px]"
}) => {
  return (
    <div className={className}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[3, 3, 3]} />
          
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          
          {/* Building Model */}
          {modelUrl ? (
            <ModelLoader url={modelUrl} />
          ) : (
            <DefaultBuilding />
          )}
          
          {/* Environment and Controls */}
          <Environment preset="city" />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default BuildingPreview;