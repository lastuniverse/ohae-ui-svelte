<svelte:options customElement={{ tag: "ohae-ace-editor" }} />

<script lang="ts">
    import { initOhae, type HTMLOhaeElement } from "../../lib/ohaeUtils"; // Предполагается, что этот путь корректен
    import type { IOhaeAceEditorConfig } from "./OhaeAceEditorTypes";    // И этот

    initOhae($host(), {
        modifyAppendChild: false,
        loadFontsAwesome: false,
        loadOhaeTheme: true,
    });
        
    let { 
        aceUrl = "/ace-editor/1.41.0/ace.min.js", // URL по умолчанию для Ace
        fileUrl = undefined as string | undefined,
        mode = "javascript",
        theme = "tomorrow_night_eighties",
        fontSize = 14,
        fontFamily = "'JetBrains Mono', 'monospace', monospace",
        tabSize = 4,
        className = "", // Лучше иметь пустую строку по умолчанию
        initialContent = "// Начните писать код здесь\n" // Добавим начальный контент
    }: IOhaeAceEditorConfig = $props();

    let editor: any = null; // Экземпляр Ace Editor
    let editorContainerElement: HTMLDivElement; // DOM-элемент для редактора
    
    let aceGlobal: any = null; // Глобальный объект window.ace
    let isLoadingAce = $state(false); // Состояние загрузки скрипта Ace
    let aceLoadError = $state<string | null>(null); // Ошибка загрузки Ace

    $effect(() => {
        if (aceGlobal || isLoadingAce) return;

        isLoadingAce = true;
        aceLoadError = null;
        const script = document.createElement('script');
        script.src = aceUrl;
        script.async = true;
        script.type = 'text/javascript';
        script.charset = 'utf-8';

        script.onload = () => {
            if (typeof (window as any).ace === 'undefined') {
                const errorMsg = `Объект Ace (window.ace) не найден после загрузки скрипта: ${aceUrl}`;
                console.error(errorMsg);
                aceLoadError = errorMsg;
                isLoadingAce = false;
                return;
            }
            console.log("Ace Editor script loaded successfully from:", aceUrl);
            aceGlobal = (window as any).ace;
            
            // Очень важно настроить basePath, чтобы Ace мог находить свои воркеры, темы и режимы
            // Обычно это директория, где лежит сам ace.js
            const basePath = aceUrl.substring(0, aceUrl.lastIndexOf('/') + 1);
            aceGlobal.config.set("basePath", basePath);
            aceGlobal.config.set("modePath", basePath); // Для режимов
            aceGlobal.config.set("themePath", basePath); // Для тем
            aceGlobal.config.set("workerPath", basePath); // Для воркеров (проверка синтаксиса и т.д.)
            isLoadingAce = false;
            initAceEditor();
            // Инициализация редактора произойдет в другом $effect, который зависит от aceGlobal и editorContainerElement
        };

        script.onerror = (event: Event | string) => {
            const errorMsg = `Ошибка загрузки скрипта Ace Editor: ${aceUrl}. Событие: ${event}`;
            console.error(errorMsg, event);
            aceLoadError = errorMsg;
            isLoadingAce = false;
        };

        document.head.appendChild(script);

        // Функция очистки для $effect
        return () => {
            console.log("Cleaning up Ace Editor script and instance.");
            if (editor) {
                editor.destroy();
                editor = null;
            }
            // Удаляем скрипт из head
            // Проверяем, существует ли еще скрипт, прежде чем удалять
            const existingScript = document.querySelector(`script[src="${aceUrl}"]`);
            if (existingScript && existingScript.parentNode) {
                existingScript.parentNode.removeChild(existingScript);
            }
            aceGlobal = null; // Сбрасываем ссылку на Ace
            // (window as any).ace может все еще существовать, если скрипт не выгружается полностью,
            // но наш компонент больше не будет на него ссылаться.
        };
    });

    // Эффект для инициализации и обновления редактора
    function initAceEditor() {
        if (!aceGlobal || !editorContainerElement) {
            console.log("Ace не загружен или контейнер еще не отрисован...");
            return;
        }

        if (!editor) {
            // Инициализация редактора, если он еще не создан
            console.log("Initializing Ace Editor instance...");
            editor = aceGlobal.edit(editorContainerElement);
            
            const host: HTMLOhaeElement = $host();
            if (host && host.shadowRoot) {
                // Привязка Ace Editor к Shadow DOM, если компонент используется как custom element
                // и имеет shadowRoot. Это важно для корректной работы курсора, выделения и т.д.
                editor.renderer.attachToShadowRoot();
            }
            
            // Устанавливаем начальное значение, если fileUrl не указан
            if (!fileUrl) {
                editor.setValue(initialContent, -1); // -1 перемещает курсор в начало
            }
        }

        editor.setTheme(`ace/theme/${theme}`);
        editor.session.setMode(`ace/mode/${mode}`);
        editor.setOptions({
            fontFamily: fontFamily,
            fontSize: parseInt(fontSize as any, 10),
            tabSize: parseInt(tabSize as any, 10),
            useSoftTabs: true,
            autoScrollEditorIntoView: true,
            // value: здесь не устанавливаем, т.к. управляется fileUrl или initialContent
        });
        
        // Загрузка контента из fileUrl, если он предоставлен и изменился
        if (fileUrl) {
            console.log(`Attempting to load content from: ${fileUrl}`);
            fetch(fileUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status} for ${fileUrl}`);
                    }
                    return response.text();
                })
                .then(text => {
                    if (editor) { // Убедимся, что редактор все еще существует
                        editor.setValue(text, -1);
                        console.log(`Content loaded successfully from: ${fileUrl}`);
                    }
                })
                .catch(err => {
                    console.error("Error fetching file content:", err);
                    if (editor) {
                        editor.setValue(`// Ошибка загрузки файла: ${fileUrl}\n// ${err.message}`, -1);
                    }
                });
        }
        // Если fileUrl стал undefined, а раньше был, возможно, нужно очистить редактор или установить initialContent
        // Текущая логика: если fileUrl нет, начальный контент устанавливается при инициализации.
        // Если fileUrl был, а потом стал undefined, контент останется от fileUrl.
        // Если нужно другое поведение (например, сброс к initialContent), добавьте здесь условие.

    };

    export function getValue(): string | undefined {
        return editor?.getValue();
    }

    export function setValue(content: string, cursorPos?: number): void {
        editor?.setValue(content, cursorPos);
    }

</script>

<div bind:this={editorContainerElement} class="ace-editor-container {className}">
    {#if isLoadingAce}
        <p>Загрузка Ace Editor...</p>
    {:else if aceLoadError}
        <p style="color: red;">Ошибка загрузки Ace Editor: {aceLoadError}</p>
    {/if}
    <!-- Ace Editor будет инициализирован здесь -->
</div>

<style>
    :host,
    .ace-editor-container {
        box-sizing: border-box;
        border: none;
        padding: 0;
        margin: 0;
        position: relative; /* Важно для позиционирования элементов Ace */
        width: 100%; /* По умолчанию занимать всю доступную ширину */
        /* height: 300px; */
        overflow: hidden; /* Чтобы скроллбары Ace работали корректно */
    }

    :host {
        flex: 1 1 0;
        display: flex;
        /* min-height: 100px; */
    }

    .ace-editor-container {
        display: block;
        height: 100%;
        width: 100%;
        background-color: #1d1f21; /* Фоновый цвет по умолчанию, Ace его перекроет */
    }

    .ace-editor-container p { /* Стили для сообщений о загрузке/ошибке */
        padding: 10px;
        margin: 0;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #ccc;
    }

    /* 
      Ace Editor добавляет свои собственные классы, например, .ace_editor.
      Если нужно переопределить что-то очень специфичное для Ace, можно это сделать здесь,
      но обычно темы Ace справляются с этим.
      Пример:
      :global(.ace_editor) {
          font-family: var(--ace-font-family, 'JetBrains Mono', 'monospace', monospace) !important;
      }
    */
</style>