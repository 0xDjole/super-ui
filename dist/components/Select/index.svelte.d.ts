import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        value: string | number | boolean;
        defaultOption: any;
        options?: any[] | undefined;
        label?: string | undefined;
        labelThumbnail?: null | undefined;
        errors?: any[] | undefined;
    };
    events: {
        change: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type IndexProps = typeof __propDef.props;
export type IndexEvents = typeof __propDef.events;
export type IndexSlots = typeof __propDef.slots;
export default class Index extends SvelteComponentTyped<IndexProps, IndexEvents, IndexSlots> {
}
export {};
