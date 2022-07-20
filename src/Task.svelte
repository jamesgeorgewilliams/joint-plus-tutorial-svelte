<script>
  export let title, assignment, status, scale;

  let taskElement;
  let taskElementPosition = { x: 0, y: 0 };
  //   let taskElementStyle = {
  //     top: (taskElementPosition.y || 0) + 'px',
  //     left: (taskElementPosition.x || 0) + 'px',
  //     transform: 'scale(' + scale + ')',
  //     transformOrigin: '0 0',
  //   };
</script>

<div
  bind:this={taskElement}
  class="task"
  data-status={status}
  style:top={(taskElementPosition.y || 0) + 'px'}
  style:left={(taskElementPosition.x || 0) + 'px'}
  style:transform={'scale(' + scale + ')'}
  style:transformOrigin={'0 0'}
>
  <header>
    <h1>{title}</h1>
  </header>
  <input type="text" placeholder="Enter an assignment …" value={assignment} />
  <select value={status}>
    <option disabled value="">Select status …</option>
    <option value="done">Done</option>
    <option value="pending">Pending</option>
    <option value="at-risk">At Risk</option>
  </select>
</div>
