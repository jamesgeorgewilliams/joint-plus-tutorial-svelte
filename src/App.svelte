<script lang="ts">
  //@ts-nocheck
  import { onMount } from 'svelte';
  import { dia, ui, shapes } from '@clientio/rappid';
  import Toolbar from './Toolbar.svelte';
  import Task from './Task.svelte';
  import '../node_modules/@clientio/rappid/rappid.css';

  const DATA = {
    scale: 1,
    tasks: [
      {
        name: 'taskA',
        title: 'Create Story',
        assignment: 'Bob',
        status: 'done',
      },
      {
        name: 'taskB',
        title: 'Promote',
        assignment: 'Mary',
        status: 'pending',
      },
      {
        name: 'taskC',
        title: 'Measure',
        assignment: 'John',
        status: 'at-risk',
      },
    ],
  };

  let ref;

  onMount(async () => {
    const namespace = shapes;

    const graph = new dia.Graph({}, { cellNamespace: namespace });

    const paper = new dia.Paper({
      model: graph,
      background: {
        color: '#F8F9FA',
      },
      frozen: true,
      async: true,
      cellViewNamespace: namespace,
    });

    const scroller = new ui.PaperScroller({
      paper,
      autoResizePaper: true,
      cursor: 'grab',
    });

    // ref.appendChild(scroller.el);
    // scroller.render().center();

    // const rect = new shapes.standard.Rectangle({
    //   position: { x: 100, y: 100 },
    //   size: { width: 100, height: 50 },
    //   attrs: {
    //     label: {
    //       text: 'Hello World',
    //     },
    //   },
    // });

    // graph.addCell(rect);
    // Create JointJS elements and links for the tasks
    var rect1 = new shapes.standard.Rectangle()
      .position(17, 100)
      .attr({
        body: { fill: 'transparent', strokeWidth: 0 },
      })
      .prop('id', 'taskA');
    var rect2 = rect1.clone().position(297, 100).prop('id', 'taskB');
    var rect3 = rect1.clone().position(576, 100).prop('id', 'taskC');
    var link1 = new shapes.standard.Link().source(rect1).target(rect2);
    var link2 = new shapes.standard.Link().source(rect2).target(rect3);
    graph.resetCells([rect1, rect2, rect3, link1, link2]);
    paper.unfreeze();
  });
</script>

<!-- <main bind:this={ref} class="app" /> -->
<Toolbar />
{#each DATA.tasks as task, i}
  <Task
    title={task.title}
    assignment={task.assignment}
    status={task.status}
    scale={DATA.scale}
  />
{/each}

<style>
</style>
