import { writable } from 'svelte/store';
import { dia, shapes, util } from '@clientio/rappid';
import { TabsData } from './tabs-data';

export const createTabState = (title: string, json?: any) => {
    const graph = new dia.Graph({ id: util.uuid() }, { cellNamespace: shapes });
    let focusPoint;
    if (json) {
      graph.fromJSON(json);
      focusPoint = graph.getBBox()?.center().toJSON();
    }
    return {
      title,
      graph,
      focusPoint
    }
}

let tabs = TabsData.map(({ title, json }) => createTabState(title, json));

export const tabStore = writable(tabs);
