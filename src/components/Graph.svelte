<script>
    import { onMount } from 'svelte';
    import { dia, ui, shapes } from '@clientio/rappid';

    export let index;
    export let tabs;

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

        if (focusPoint) {
            scroller.center(focusPoint.x, focusPoint.y);
        } else {
            scroller.center();
        }

        paper.unfreeze();
	});
</script>

<div class='wrapper'>
</div>
