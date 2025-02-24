<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	import Button from '../Button/index.svelte';
	import NiceSelect from '../NiceSelect/index.svelte';
	import Modal from '../Modal/index.svelte';
	import translate from '../../utils/helpers/translate';
	import TextArea from '../TextArea/index.svelte';
	import Label from '../Label.svelte';
	import Map from '../Map/index.svelte';
	import Badges from './Badges.svelte';

	interface Props {
		fields?: any;
		fieldConfigs?: any;
		locale?: string;
		label?: any;
		t: any;
		type?: string;
		shareData?: any;
		entities?: import('svelte').Snippet<[any]>;
		custom?: import('svelte').Snippet<[any]>;
	}

	let {
		fields = [],
		fieldConfigs = [],
		locale = 'en',
		label = null,
		t,
		type = 'regular',
		shareData = {
		title: '',
		text: '',
		url: ''
	},
		entities,
		custom
	}: Props = $props();

	let values = $state([]);
	let key = $state('');

	const viewMultipleValues = (field) => {
		key = field.key;
		values = field.value.map((value) => ({
			label: value,
			value
		}));
	};
</script>

{#if type === 'regular'}
	<Modal
		showModal={values.length}
		confirmText="Close"
		title={key}
		zIndex={1000}
		confirm={() => {
			values = [];
			key = '';
		}}
		onCancel={() => {
			values = [];
			key = '';
		}}
	>
		<div class="modal-body">
			<NiceSelect disabled={true} options={values} />
		</div>
	</Modal>

	{#if label}
		<div class="mb-5">
			<Label {t} {label} />
		</div>
	{/if}

	<ul class="custom-field-body">
		{#each fields
			.filter((field) => field.value !== null && !(Array.isArray(field.value) && !field.value.length))
			.map( (field) => ({ field, fieldConfig: fieldConfigs.find((fieldConfig) => fieldConfig.id === field.fieldConfigId) }) ) as { field, fieldConfig }, index}
			{#if fieldConfig}
				{#if fieldConfig.type === 'entities'}
					{@render entities?.({ idx: index, value: field.value, fieldConfig, })}
				{:else if fieldConfig.type === 'geo_location'}
					<Map zoom={17} allowTag={false} value={field.value} />
				{:else if fieldConfig.type === 'text' && fieldConfig.ui === 'html'}
					<div class="html-text">
						{@html translate(fieldConfig.defaultValue, locale)}
					</div>
				{:else if fieldConfig.type === 'text' && fieldConfig.ui === 'text_area'}
					<TextArea
						{t}
						style="height: min-content;"
						label={translate(fieldConfig.key, locale)}
						bind:value={field.value}
						errors={[]}
						isDisabled={true}
					/>
				{:else if fieldConfig.type === 'custom'}
					{@render custom?.({ idx: index, errors: field.errors, value: field.value, fieldConfig, })}
				{:else if fieldConfig.type === 'badge'}{:else if field.value}
					<div
						class="field"
						onclick={preventDefault(() => Array.isArray(field.value) && viewMultipleValues(field))}
					>
						<div class="key">{translate(fieldConfig.key, locale)}</div>
						<div class="value">
							{#if typeof field.value === 'boolean'}
								<Button kind={field.value ? 'success' : 'close'} />
							{:else if Array.isArray(field.value)}
								<div class="view-button">
									{field.value.join(', ')}
								</div>
							{:else}
								<span>{field.value}</span>
							{/if}
						</div>
					</div>
				{/if}
			{/if}
		{/each}
	</ul>
{/if}

{#if type === 'badges'}
	<Badges {shareData} {fieldConfigs} {fields} {t} {label} />
{/if}

<style type="text/postcss">
	.custom-field-body {
		@apply flex flex-col rounded-md gap-y-2 h-full w-full;
	}

	.key {
		@apply min-w-[130px] pl-2;
	}

	.field {
		@apply flex cursor-pointer text-primary items-center gap-x-2 font-bold bg-secondary rounded-2xl justify-between h-[30px] md:h-[40px] md:text-lg border-primary;
	}

	.value {
		@apply flex bg-accent rounded-xl px-3 h-full items-center justify-end rounded-l-none text-white flex-1;
		white-space: normal;
		overflow: auto;
	}

	.view-button {
		@apply w-full text-end cursor-pointer;
	}

	.modal-body {
		@apply m-3;
	}

	.html-text {
		@apply text-primary;
		line-height: 1.6;
	}

	:global(.html-text h1) {
		@apply text-2xl font-bold mb-3;
	}

	:global(.html-text h2) {
		@apply text-xl font-bold mb-2;
	}

	:global(.html-text h3) {
		@apply text-base font-bold mb-1;
	}

	:global(.html-text p) {
		@apply mb-2 text-base leading-relaxed;
	}

	:global(.html-text ul) {
		@apply list-none list-inside;
	}

	:global(.html-text li) {
		@apply mb-1;
	}

	:global(.html-text a) {
		@apply text-blue-600 hover:text-blue-800 underline;
	}

	:global(.html-text strong) {
		@apply font-bold;
	}

	:global(.html-text em) {
		@apply italic;
	}

	/* Responsive styles */
	@media (min-width: 768px) {
		:global(.html-text h1) {
			@apply text-3xl;
		}

		:global(.html-text h2) {
			@apply text-2xl;
		}

		:global(.html-text h3) {
			@apply text-xl;
		}

		:global(.html-text p, .html-text li) {
			@apply text-lg;
		}
	}
</style>
