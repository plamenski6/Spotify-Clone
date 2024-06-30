<script lang="ts">
	import Navigation from "./Navigation.svelte";


</script>

<div class="content">
    <div class="left">
        <Navigation desktop={false} />
    </div>
    <div class="right">Right</div>
</div>

<style lang="scss">
    .content { 
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
</style>