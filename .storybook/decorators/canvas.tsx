import type { GizmoHelperProps , GridProps } from '@react-three/drei';
import { GizmoViewport, GizmoHelper, OrbitControls, Grid, Environment  } from '@react-three/drei';
import type { CameraProps } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import type { Decorator } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

const gridSize: GridProps['args'] = [ 10.5, 10.5 ];

const gridProps: GridProps = {
  cellSize: 1,
  cellThickness: 1,
  cellColor: '#5e5e5e',
  sectionSize: 5,
  sectionThickness: 1.5,
  sectionColor: '#9d4b4b',
  fadeDistance: 80,
  fadeStrength: 1,
  followCamera: false,
  infiniteGrid: true,
};

const CanvasActiveDecorator: Decorator = (Story, context) => {
  const { three } = context.parameters;
  const threeSettings = typeof three === 'object' ? three : {};

  const margin = useMemo<GizmoHelperProps['margin']>(() => [ 80, 80 ], []);
  const axisColors = useMemo<
    ComponentProps<typeof GizmoViewport>['axisColors']
  >(() => [ 'red', 'green', 'blue' ], []);

  const camera = useMemo(() => {
    const cameraProps: CameraProps = typeof threeSettings.camera === 'object' ? threeSettings.camera : {
      position: [ 10, 10, 10 ],
      fov: 25,
    };
    return cameraProps;
  }, [ threeSettings.camera ]);

  const orbitTarget = useMemo(() => [ 0, 0, 0 ] as [ number, number, number ], []);

  return (
    <div className="relative h-full">
      <div className="absolute inset-0">
        <Canvas camera={camera}>
          <color attach="background" args={[ threeSettings.backgroundColor ?? '#ffffff' ]} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            makeDefault
            target={orbitTarget}
          />
          <GizmoHelper
            alignment="bottom-right"
            margin={margin}
          >
            <GizmoViewport axisColors={axisColors} labelColor="black" />
            {threeSettings?.grid && <Grid args={gridSize} {...gridProps} />}
            {threeSettings?.environment && (
              <Environment
                preset={typeof threeSettings.environment === 'string' ? threeSettings.environment : 'city'}
              />
            )}
          </GizmoHelper>
          <Story />
        </Canvas>
      </div>
    </div>
  );
};

export const CanvasDecorator: Decorator = (Story, context) => {
  if(context.parameters?.three) {
    return CanvasActiveDecorator(Story, context);
  }

  return <Story />;
};
