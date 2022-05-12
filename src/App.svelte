<script lang="ts">
    import { dia, shapes, util } from '@clientio/rappid';
    import { Tabs, TabList, TabPanel, Tab } from './components/tabs';
    import Graph from './components/Graph.svelte';
    import { TabsData } from './tabs-data'
    import { HyperlinkHighlighter } from './hyperlink-highlighter';
    import '../node_modules/@clientio/rappid/rappid.css';

    import {tabStore} from './store';

    let tabs;

    tabStore.subscribe((val) => {
        tabs = val;
        console.log(val)
    });
</script>

<Tabs>
    <TabList>
        {#each tabs as tab }
            <Tab>
                {tab.title}
            </Tab>
        {/each}
    </TabList>
    {#each tabs as tab }
        <TabPanel>
            {tab.title}
        </TabPanel>
    {/each}
</Tabs>

<style>
</style>
