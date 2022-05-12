<script>
    import { onMount } from 'svelte';
    import { dia, ui, shapes } from '@clientio/rappid';
    import { HyperlinkHighlighter } from '../hyperlink-highlighter.ts';
    import { tabStore } from '../store';

    let tabs;

    tabStore.subscribe((store) => {
        tabs = store;
    });

    export let index;

    let paper;
    let scroller;

    onMount(async () => {
        const wrapper = document.querySelector('.wrapper');

        const { graph, focusPoint } = tabs[index];
        paper = new dia.Paper({
            model: graph,
            background: {
            color: '#F8F9FA',
            },
            frozen: true,
            async: true,
            gridSize: 10,
            cellViewNamespace: shapes,
            defaultConnectionPoint: { name: 'boundary' },
        });
        scroller = new ui.PaperScroller({
            paper,
            baseWidth: 10,
            baseHeight: 10,
            autoResizePaper: true,
            contentOptions: {
            minWidth: 600,
            allowNewOrigin: 'any',
            allowNegativeBottomRight: true,
            useModelGeometry: true,
            padding: 100
            },
            cursor: 'grab'
        });

        wrapper.appendChild(scroller.el);
        scroller.render().adjustPaper();

        paper.on('blank:pointerdown', (evt) => {
            scroller.startPanning(evt);
        });

        paper.unfreeze();
	});
</script>

<div class='wrapper'>
</div>
