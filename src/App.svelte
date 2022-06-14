<script lang="ts">
  import { onMount } from 'svelte';
  import { dia, ui, shapes, highlighters } from '@clientio/rappid';
  import { TreeView } from 'carbon-components-svelte';
  import Element from './icons/Element.svelte';
  import Link from './icons/Link.svelte';
  import { TreeData } from './tree-data';
  import '../node_modules/@clientio/rappid/rappid.css';

  let ref;

  const [initialDiagram = { id: '', cells: [] }] = TreeData;

  let graph = (function () {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    graph.fromJSON(initialDiagram);
    return graph;
  })();

  const diagrams = TreeData.map((diagram) => {
    const graph = new dia.Graph({}, { cellNamespace: shapes });
    graph.fromJSON(diagram);

    return {
      id: diagram.id,
      name: diagram.name,
      graph,
      nodes: graph.getCells().map((cell) => {
        return {
          id: `${diagram.id}-${cell.id}`,
          name: cell.isElement()
            ? cell.attr(['label', 'text']) || `Element (${cell.id})`
            : cell.prop(['labels', 0, 'attrs', 'text', 'text']) ||
              `Link (${cell.id})`,
          isElement: cell.isElement(),
        };
      }),
    };
  });

  /* 
    TreeView Props
    https://carbon-components-svelte.onrender.com/components/TreeView
  */
  let activeId = '';
  let selectedIds = [];
  let expandedIds = [];
  let hideLabel = true;
  // Create TreeItems according to carbon svelte componet requirements
  let children = diagrams.map((diagram) => {
    return {
      id: diagram.id,
      text: diagram.name,
      children: diagram.nodes.map((node) => {
        return {
          id: node.id,
          text: node.name,
          icon: node.isElement ? Element : Link,
        };
      }),
    };
  });

  onMount(() => {
    const namespace = shapes;

    const paper = new dia.Paper({
      model: graph,
      frozen: true,
      async: true,
      cellViewNamespace: namespace,
      clickThreshold: 10,
      moveThreshold: 10,
      interactive: false,
      defaultConnectionPoint: {
        name: 'boundary',
      },
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab',
      baseWidth: 1,
      baseHeight: 1,
      padding: 0,
      contentOptions: {
        useModelGeometry: true,
        padding: 200,
      },
    });

    ref.appendChild(scroller.el);
    scroller.render().centerContent({ useModelGeometry: true });
    paper.unfreeze();

    // User Interactions

    paper.on('cell:pointerclick', (cellView) => {
      const cell = cellView.model;
      const nodeId = `${graph.id}-${cell.id}`;
      graph.set('selectedCell', cell.id);
      activeId = nodeId;
      selectedIds = [...nodeId];
      if (!expandedIds.includes(nodeId.split('-')[0])) {
        expandedIds = [...expandedIds, nodeId.split('-')[0]];
      }
    });

    paper.on('blank:pointerclick', () => {
      graph.set('selectedCell', null);
      activeId = `${graph.id}`;
      selectedIds = [`${graph.id}`];
      (document.activeElement as HTMLElement)?.blur();
    });

    paper.on('blank:pointerdown', (evt) => scroller.startPanning(evt));

    // Selection Frame

    let selectionFrame: highlighters.mask | null = null;

    paper.listenTo(graph, 'change:selectedCell', () => {
      if (selectionFrame) {
        selectionFrame.remove();
        selectionFrame = null;
      }
      const cellId = graph.get('selectedCell');
      const cell = graph.getCell(cellId);
      if (cell) {
        selectionFrame = highlighters.mask.add(
          cell.findView(paper),
          cell.isLink() ? 'line' : 'body',
          'selection-frame',
          {
            layer: dia.Paper.Layers.BACK,
            padding: 4,
            attrs: {
              'stroke-width': 2,
              'stroke-linecap': 'round',
              opacity: '0.6',
            },
          }
        );
      }
    });
  });

  const selectNode = (nodeId) => {
    const [diagramId, cellId = null] = nodeId.split('-');
    // const [selectedDiagramId] = selectedTreeNode.split('-');
    // if (diagramId !== selectedDiagramId) {
    //   const prevDiagram = diagrams.find(
    //     (diagram) => diagram.id === selectedDiagramId
    //   );
    //   if (prevDiagram) {
    //     // Save Changes (not in use since the demo is in view-only mode)
    //     prevDiagram.graph.fromJSON(graph.toJSON());
    //   }
    //   const diagram = diagrams.find((diagram) => diagram.id === diagramId);
    //   if (diagram) {
    //     graph.fromJSON(diagram.graph.toJSON());
    //   }
    //   graph.set("selectedCell", cellId);
    // }
    const diagram = diagrams.find((diagram) => diagram.id === diagramId);
    if (diagram) {
      graph.fromJSON(diagram.graph.toJSON());
    }
    graph.set('selectedCell', cellId);
  };
</script>

<main class="app">
  <TreeView
    {hideLabel}
    {children}
    bind:activeId
    bind:selectedIds
    bind:expandedIds
    on:select={({ detail }) => {
      selectNode(detail.id);
      //   if (detail.leaf === false && detail.expanded === false) {
      //     //@ts-ignore
      //     expandedIds = [...expandedIds, detail.id.split('-')[0]];
      //   }
      //   if (detail.leaf === false && detail.expanded === true) {
      //     //@ts-ignore
      //     expandedIds = expandedIds.filter((id) => id !== detail.id);
      //   }
    }}
    on:toggle={({ detail }) => console.log('toggle', detail)}
    on:focus={({ detail }) => console.log('focus', detail)}
  />
  <div bind:this={ref} class="canvas" />
</main>

<style>
</style>
