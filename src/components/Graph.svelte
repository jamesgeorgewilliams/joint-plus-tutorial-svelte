<script>
    import { onMount, getContext } from 'svelte';
    import { dia, ui, shapes } from '@clientio/rappid';
    import { HyperlinkHighlighter } from '../hyperlink-highlighter.ts';
    import { TABS } from './Tabs.svelte';
    import { tabStore } from '../store';

    export let index;

    const { updateTabByIndex } = getContext(TABS);

    let tabs;

    tabStore.subscribe((store) => {
        tabs = store;
    });

    let paper;
    let scroller;

    const theme = 'material';

    onMount(async () => {
        appendGraph();
	});

    const appendGraph = () => {
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

        paper.on('element:link', (elementView, evt) => {
            const { subgraphId } = elementView.model.attributes;
            if (!subgraphId) return;
            evt.stopPropagation();
            selectGraph(subgraphId);
        });

        paper.on('blank:pointerdown', (evt) => {
            scroller.startPanning(evt);
        });

        graph.getElements().forEach((element) => {
            HyperlinkHighlighter.addToLabel(element, paper, 'subgraphId');
        });
        
        if (focusPoint) {
            scroller.center(focusPoint.x, focusPoint.y);
        } else {
            scroller.center();
        }

        paper.unfreeze();
    }

    // Change tab attributes at the specified index.
    // const changeTab = (index, change) => {
        // setTabs(prevState => prevState.map((tab, i) => {
        //     if (i !== index) return tab;
        //     return {
        //         ...tab,
        //         ...change
        //     }
        // }));
    // }

    // Select a tab at the specified index
    // const selectTab = (index) => {
    //     console.log(index);
    // }
    // const selectTab = (index, prevIndex = tabIndex) => {
        // if (prevIndex === index) return;
        // if (scroller) {
        // const focusPoint = scroller.getVisibleArea().center().toJSON();
        //     changeTab(prevIndex, { focusPoint });
        // }
        // setTabIndex(Math.max(Math.min(index, tabs.length - 1), 0));
    // }

   // Change tab attributes at the specified index
//    const changeTab = (index, change) => {

//        tabStore.update((store) => {
//            console.log(store);

//            return store.map((tab, i) => {
//                if (i !== index) return tab;
//                return {
//                    ...tab,
//                    ...change
//                }
//            });
//        });

//        tabStore.subscribe((store) => {
//            console.log(store)
//        })
//    }

   // Select a tab at the specified index
//    const selectTab = (index, prevIndex) => {
//         if (prevIndex === index) return;
//         if (scroller) {
//         const focusPoint = scroller.getVisibleArea().center().toJSON();
//         changeTab(prevIndex, { focusPoint });
//         }
//    }

   // Select a tab by its graph Id
    const selectGraph = (graphId) => {
        // const tabsNodeList = document.querySelectorAll('.tab-list > .btn');
        // const tabsArray = Array.from(tabsNodeList);
        // const prevIndex = tabsArray.findIndex((tab) => tab.classList.contains('selected'));
        const index = tabs.findIndex(tab => tab.graph.id === graphId);
        // console.log(index, prevIndex);
        if (index > -1) {
            // selectTab(index, prevIndex);
            updateTabByIndex(index);
        } else {
        const message = new ui.FlashMessage({
            theme,
            content: `Invalid sub-process ID: ${graphId}`,
        });
            message.open();
        }
    }
</script>

<div class='wrapper'>
</div>
