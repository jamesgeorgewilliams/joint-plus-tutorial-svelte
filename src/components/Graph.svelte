<script>
    import { onMount, getContext } from "svelte";
    import { dia, ui, shapes } from "@clientio/rappid";
    import { HyperlinkHighlighter } from "../hyperlink-highlighter.ts";
    import { TABS } from "./Tabs.svelte";
    import { tabStore } from "../store";

    export let index;
    export let tabs;

    const { updateTabByIndex } = getContext(TABS);

    let paper;
    let scroller;
    let ref;

    const theme = "material";

    onMount(async () => {
        appendGraph();
    });

    const appendGraph = () => {
        const { graph, focusPoint } = tabs[index];

        paper = new dia.Paper({
            model: graph,
            background: {
                color: "#F8F9FA",
            },
            frozen: true,
            async: true,
            gridSize: 10,
            cellViewNamespace: shapes,
            defaultConnectionPoint: { name: "boundary" },
        });
        scroller = new ui.PaperScroller({
            paper,
            baseWidth: 10,
            baseHeight: 10,
            autoResizePaper: true,
            contentOptions: {
                minWidth: 600,
                allowNewOrigin: "any",
                allowNegativeBottomRight: true,
                useModelGeometry: true,
                padding: 100,
            },
            cursor: "grab",
        });

        ref.appendChild(scroller.el);
        scroller.render().adjustPaper();

        paper.on("element:link", (elementView, evt) => {
            const { subgraphId } = elementView.model.attributes;
            if (!subgraphId) return;
            evt.stopPropagation();
            selectGraph(subgraphId);
        });

        paper.on("blank:pointerdown", (evt) => {
            scroller.startPanning(evt);
        });

        paper.on("blank:pointerup", () => {
            const focusPoint = scroller.getVisibleArea().center().toJSON();
            updateFocusPoint(focusPoint);
        });

        graph.getElements().forEach((element) => {
            HyperlinkHighlighter.addToLabel(element, paper, "subgraphId");
        });

        if (focusPoint) {
            scroller.center(focusPoint.x, focusPoint.y);
        } else {
            scroller.center();
        }

        paper.unfreeze();
    };

    // Select a tab by its graph Id
    const selectGraph = (graphId) => {
        const index = tabs.findIndex((tab) => tab.graph.id === graphId);
        if (index > -1) {
            updateTabByIndex(index);
        } else {
            const message = new ui.FlashMessage({
                theme,
                content: `Invalid sub-process ID: ${graphId}`,
            });
            message.open();
        }
    };

    // Update scroller position
    const updateFocusPoint = (point) => {
        tabStore.update((store) => {
            store[index].focusPoint = point;
            return store;
        });
    };
</script>

<div bind:this={ref} class="wrapper" />
