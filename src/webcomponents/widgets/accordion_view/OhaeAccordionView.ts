import { OhaeUI } from "../../OhaeUI";
import { OhaeLayoutView } from "../layout-view/OhaeLayoutView";
import { OhaeAccordionItemView } from "./OhaeAccordionItemView";

export class OhaeAccordionView extends OhaeLayoutView {
    public static readonly ATTRIBUTES: string[] = [
        'multiple',
        'enableShift',
        'enableDrag',
    ];

    protected static readonly STYLES: string = `
    <style>
        :host {
            display: flex;
            /* overflow: auto; */
            box-sizing: border-box;
            padding: 0px;
            margin: 0px;
            /* flex-grow: 1; */
            /* align-items: flex-start; */ /* -??? */
            /* align-items: stretch; */ /* -??? */
        }

        :host([direction="rows"]) {
            flex-direction: column;
        }

        :host([direction="cols"]) {
            flex-direction: row;
        }

        :host([direction="cols"]) ::slotted(ohae-accordion-item-view) {
            height: 100%;
        }
    </style>
    `;
    // private draggedSection: OhaeAccordionItemView | null = null;
    public draggedSection: OhaeAccordionItemView | null = null;

    protected override async createCallback() {
        await super.createCallback();
        this.applyAttributes(OhaeAccordionView.ATTRIBUTES);
        this.addEventListener('section-toggle', this.handleSectionToggle as EventListener);
        this.addEventListener('dragover', this.handleDragOver as EventListener);
        this.addEventListener('drop', this.handleDrop as EventListener);
    }

    static get observedAttributes() {
        return [...super.observedAttributes, ...this.ATTRIBUTES];
    }

    private handleDragOver(event: DragEvent) {
        event.preventDefault();
        const target = event.target as HTMLElement;
        const section = target.closest('ohae-accordion-item') as OhaeAccordionItemView | null;
        if (section && this.draggedSection && section !== this.draggedSection) {
            const rect = section.getBoundingClientRect();
            const isAfter = event.clientY > rect.top + rect.height / 2;
            console.log(1);
            if (isAfter) {
                if(section.nextElementSibling === this.draggedSection) return
                section.after(this.draggedSection);
            } else {
                if(section.previousElementSibling === this.draggedSection) return
                // Вставляем элемент и добавляем класс для анимации
                section.before(this.draggedSection);
            }
        }
    }
    
    private handleDrop(event: DragEvent) {
        event.preventDefault();
        this.draggedSection = null;
    }

    private handleSectionToggle(event: Event) {
        const customEvent = event as CustomEvent;
        const targetSection = customEvent.detail.section as OhaeAccordionItemView;
        this.tryToggledSections(targetSection);
        this.tryShiftToggledSection(targetSection);
    }

    private tryToggledSections(ignoreSection: OhaeAccordionItemView) {
        const sections = this.querySelectorAll('ohae-accordion-item') as NodeListOf<OhaeAccordionItemView>;
        if (!this.multiple) {
            sections.forEach(section => {
                if (section !== ignoreSection) {
                    section.collapsed = true; // Сворачиваем все секции, кроме текущей
                }
            });
        }
    }

    private tryShiftToggledSection(targetSection: OhaeAccordionItemView) {
        if (this.enableShift) {
            const sections = this.querySelectorAll('ohae-accordion-item') as NodeListOf<OhaeAccordionItemView>;
            // const isColapsed = targetSection.collapsed;
            Array.from(sections).some(section => {
                if (section !== targetSection && section.collapsed) {
                    // if (isColapsed) {
                    //     this.insertBefore(targetSection, section);
                    // } else {
                        this.insertBefore(targetSection, section);
                    // }
                    return true;
                }
            });
            this.scrollTop = 0;
        }
    }


    get multiple(): boolean {
        return this.getAttribute('multiple') === 'true';
    };
    set multiple(value: boolean | string | null) {
        this.setBooleanAttribute('multiple', value);
    }

    get enableShift(): boolean {
        return this.getAttribute('enableShift') === 'true';
    };
    set enableShift(value: boolean | string | null) {
        this.setBooleanAttribute('enableShift', value);
    }
    
    get enableDrag(): boolean {
        return this.getAttribute('enableDrag') === 'true';
    };
    set enableDrag(value: boolean | string | null) {
        this.setBooleanAttribute('enableDrag', value);
    }

    

    // get direction(): 'rows' | 'cols' | undefined {
    //     return this.getAttribute('direction') as 'rows' | 'cols' | undefined;
    // }
}

OhaeUI.registerViewType('accordion', OhaeAccordionView);

declare module "../../OhaeViewOptions" {
    interface IOhaeViewOptions {
        enableShift?: string | boolean;
        multiple?: string | boolean | number;
    }
}
