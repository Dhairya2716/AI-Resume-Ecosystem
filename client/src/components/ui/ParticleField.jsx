import { useEffect, useRef } from "react";
import * as THREE from "three";

// The visual argument of the whole page in one animation: scattered points
// (unstructured experience) pull together into a tight rectangle (the
// manuscript), hold, then blow apart and re-form. Runs behind the redline
// card in the hero — ambient, not decorative noise.

const COUNT = 850;

function seededScatter() {
    const r = 3.4 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    return [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.9,
        r * Math.cos(phi) * 0.6,
    ];
}

function seededDocument() {
    const w = 2.6;
    const h = 3.4;
    // bias samples toward the edges so the rectangle silhouette reads clearly
    const edge = Math.random() < 0.55;
    let x, y;
    if (edge) {
        const onVertical = Math.random() < 0.5;
        x = onVertical ? (Math.random() < 0.5 ? -w / 2 : w / 2) : (Math.random() - 0.5) * w;
        y = onVertical ? (Math.random() - 0.5) * h : (Math.random() < 0.5 ? -h / 2 : h / 2);
    } else {
        x = (Math.random() - 0.5) * w;
        y = (Math.random() - 0.5) * h;
    }
    const z = (Math.random() - 0.5) * 0.25;
    return [x + (Math.random() - 0.5) * 0.08, y + (Math.random() - 0.5) * 0.08, z];
}

function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function ParticleField() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        let width = mount.clientWidth;
        let height = mount.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.z = 7.5;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        mount.appendChild(renderer.domElement);

        const restPositions = new Float32Array(COUNT * 3);
        const scatterPositions = new Float32Array(COUNT * 3);
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);

        const ink = new THREE.Color("#1a2130");
        const redline = new THREE.Color("#c81e3d");
        const faint = new THREE.Color("#8890a0");

        for (let i = 0; i < COUNT; i++) {
            const [dx, dy, dz] = seededDocument();
            const [sx, sy, sz] = seededScatter();
            restPositions.set([dx, dy, dz], i * 3);
            scatterPositions.set([sx, sy, sz], i * 3);
            positions.set([dx, dy, dz], i * 3);

            const roll = Math.random();
            const c = roll > 0.93 ? redline : roll > 0.55 ? ink : faint;
            colors.set([c.r, c.g, c.b], i * 3);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.052,
            vertexColors: true,
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        let raf;
        const start = performance.now();
        const cycle = 8600; // ms for one full assemble -> hold -> explode -> reform loop

        function render(now) {
            raf = requestAnimationFrame(render);

            if (reduceMotion) {
                renderer.render(scene, camera);
                return;
            }

            const elapsed = (now - start) % cycle;
            const phase = elapsed / cycle;

            // 0.00–0.45 hold as document, 0.45–0.7 explode, 0.7–1.0 reform
            let t;
            if (phase < 0.45) {
                t = 0;
            } else if (phase < 0.7) {
                t = ease((phase - 0.45) / 0.25);
            } else {
                t = 1 - ease((phase - 0.7) / 0.3);
            }

            const posAttr = geometry.attributes.position;
            for (let i = 0; i < COUNT; i++) {
                const ix = i * 3;
                posAttr.array[ix] = restPositions[ix] + (scatterPositions[ix] - restPositions[ix]) * t;
                posAttr.array[ix + 1] = restPositions[ix + 1] + (scatterPositions[ix + 1] - restPositions[ix + 1]) * t;
                posAttr.array[ix + 2] = restPositions[ix + 2] + (scatterPositions[ix + 2] - restPositions[ix + 2]) * t;
            }
            posAttr.needsUpdate = true;

            points.rotation.y = Math.sin(phase * Math.PI * 2) * 0.06 + phase * 0.35;

            renderer.render(scene, camera);
        }

        render(start);

        function handleResize() {
            width = mount.clientWidth;
            height = mount.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }
        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} aria-hidden="true" style={{ position: "absolute", inset: 0 }} />;
}