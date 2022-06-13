<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { dia, ui, shapes } from "@clientio/rappid";
  import { TreeView } from "carbon-components-svelte";
  import Element from "./icons/Element.svelte";
  import Link from "./icons/Link.svelte";
  import { TreeData } from "./tree-data";
  // import "carbon-components-svelte/css/white.css";
  import "../node_modules/@clientio/rappid/rappid.css";

  let ref;

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
            ? cell.attr(["label", "text"]) || `Element (${cell.id})`
            : cell.prop(["labels", 0, "attrs", "text", "text"]) ||
              `Link (${cell.id})`,
          isElement: cell.isElement(),
        };
      }),
    };
  });

  let activeId = "";
  let selectedIds = [];
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

  $: currentGraph = diagrams[0].graph;

  onMount(async () => {
    const namespace = shapes;

    const graph = currentGraph;

    const paper = new dia.Paper({
      el: document.getElementById("root"),
      model: graph,
      frozen: true,
      async: true,
      cellViewNamespace: namespace,
      clickThreshold: 10,
      moveThreshold: 10,
      interactive: false,
      defaultConnectionPoint: {
        name: "boundary",
      },
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: "grab",
      baseWidth: 1,
      baseHeight: 1,
      padding: 0,
      contentOptions: {
        useModelGeometry: true,
        padding: 200,
      },
    });

    ref.appendChild(scroller.el);
    scroller.render().center({ useModelGeometry: true });
    paper.unfreeze();
  });
</script>

<main class="app">
  <TreeView
    {children}
    bind:activeId
    bind:selectedIds
    on:select={({ detail }) => console.log("select", detail)}
    on:toggle={({ detail }) => console.log("toggle", detail)}
    on:focus={({ detail }) => console.log("focus", detail)}
  />
  <!-- <div>Active node id: {activeId}</div>
    <div>Selected ids: {JSON.stringify(selectedIds)}</div> -->
  <div bind:this={ref} class="canvas" />
</main>

<style>
  div {
    margin-top: var(--cds-spacing-05);
  }
</style>
