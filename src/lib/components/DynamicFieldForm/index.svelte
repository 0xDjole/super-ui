<script lang="ts">
	import { run } from 'svelte/legacy';

	import Switch from '../Switch/index.svelte';
	import Range from '../Range/index.svelte';
	import DropDown from '../DropDown/index.svelte';
	import Select from '../NiceSelect/index.svelte';
	import TextArea from '../TextArea/index.svelte';
	import translate from '../../utils/helpers/translate';

	interface Props {
		label?: string;
		fieldConfigs?: any;
		fields?: any;
		locale?: string;
		t: any;
		theme?: any;
		entities?: import('svelte').Snippet<[any]>;
		custom?: import('svelte').Snippet<[any]>;
	}

	let {
		label = 'Custom fieldConfigs',
		fieldConfigs = $bindable([]),
		fields = $bindable([]),
		locale = 'en',
		t,
		theme = null,
		entities,
		custom
	}: Props = $props();

	run(() => {
		if (fieldConfigs.length > fields.length) {
			fields = fieldConfigs.map((config, index) => ({
				fieldConfigId: config.id,
				value: fields[index]?.value || '',
				errors: fields[index]?.errors || []
			}));
		}
	});

	const parseLabel = (label) => {
		if (label.startsWith('+')) {
			return label.slice(1) + '+';
		}

		if (label.startsWith('=')) {
			return label.slice(1);
		}

		return label;
	};

	let elements = $state([]);

	run(() => {
		const errorIndex = fields.findIndex((field) => field.errors && field.errors.length);
		if (errorIndex !== -1 && elements[errorIndex]) {
			elements[errorIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	});
</script>

<div class="custom-field-config-body">
	{#each fieldConfigs as fieldConfig, index (fieldConfig.id)}
		<div class="flex gap-x-2" bind:this={elements[index]}>
			<div class="md:p-1 md:px-3 w-full box-border">
				{#if fields[index]}
					{#if fieldConfig?.type === 'text'}
						<TextArea
							{t}
							label={translate(fieldConfig.key, locale)}
							bind:value={fields[index].value}
							bind:errors={fields[index].errors}
							minLength={fieldConfig?.properties?.minLength}
							maxLength={fieldConfig?.properties?.maxLength}
						/>
					{:else if fieldConfig?.properties?.options?.length}
						{#if fieldConfig?.ui === 'nice_select'}
							<Select
								isRequired={fieldConfig.isRequired}
								{t}
								ui={fieldConfig?.ui}
								isMultiSelect={fieldConfig?.properties.isMultiSelect}
								position="horizontal"
								label={translate(fieldConfig.key, locale)}
								labelThumbnail={fieldConfig.thumbnail}
								bind:value={fields[index].value}
								bind:errors={fields[index].errors}
								options={fieldConfig.properties.options.map((option) => ({
									label: parseLabel(option),
									value: option
								}))}
							/>
						{:else}
							<DropDown
								isRequired={fieldConfig.isRequired}
								{t}
								label={translate(fieldConfig.key, locale)}
								isMultiSelect={fieldConfig?.properties.isMultiSelect}
								bind:value={fields[index].value}
								bind:errors={fields[index].errors}
								options={fieldConfig.properties.options.map((option) => ({
									label: parseLabel(option),
									value: option
								}))}
							/>
						{/if}
					{/if}

					{#if fieldConfig?.properties?.range}
						<Range
							{theme}
							isRequired={fieldConfig.isRequired}
							{t}
							label={translate(fieldConfig.key, locale)}
							bind:value={fields[index].value}
							bind:errors={fields[index].errors}
							max={+fieldConfig.properties.range.max}
							min={+fieldConfig.properties.range.min}
							id="basic-slider"
						/>
					{/if}

					{#if fieldConfig.type === 'boolean'}
						<Switch
							isRequired={fieldConfig.isRequired}
							{t}
							label={translate(fieldConfig.key, locale)}
							labelThumbnail={fieldConfig.thumbnail}
							bind:value={fields[index].value}
							bind:errors={fields[index].errors}
						/>
					{/if}

					{#if fieldConfig.type === 'entities'}
						{@render entities?.({ idx: index, value: fields[index].value, fieldConfig, })}
					{/if}

					{#if fieldConfig.type === 'custom'}
						{@render custom?.({ idx: index, errors: fields[index].errors, value: fields[index].value, fieldConfig, })}
					{/if}
				{/if}
			</div>
		</div>
	{/each}
</div>

<style type="text/postcss">
	.custom-field-config-body {
		@apply flex flex-col rounded-md p-2 gap-y-2 w-full h-min;
	}
</style>
