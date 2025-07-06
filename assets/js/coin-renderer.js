import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('coin-container');
    if (!container) return;

    // 1. Сцена
    const scene = new THREE.Scene();

    // 2. Камера
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5; // Отодвигаем камеру, чтобы видеть монету

    // 3. Рендерер
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // alpha: true Прозрачный фон
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 5. Загрузка модели
    const loader = new GLTFLoader();
    let coin; // Переменная для хранения модели монеты

    loader.load(
        '/assets/models/firecoin.glb', // <<< ПУТЬ К МОДЕЛИ
        function (gltf) {
            coin = gltf.scene;
            scene.add(coin);
        },
        undefined,
        function (error) {
            console.error('Ошибка при загрузке модели:', error);
        }
    );

    // 6. Анимация
    function animate() {
        requestAnimationFrame(animate);

        // Вращаем монету, если она уже загружена
        if (coin) {
            coin.rotation.y += 0.01; // Cкорость вращения
        }

        renderer.render(scene, camera);
    }

    animate();
    
    // Адаптация под размер окна
    window.addEventListener('resize', () => {
       if(container.clientWidth > 0 && container.clientHeight > 0) {
          camera.aspect = container.clientWidth / container.clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(container.clientWidth, container.clientHeight);
       }
    });
});