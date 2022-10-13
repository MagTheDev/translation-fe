<template>
	<div class="container">



		<div class="navbar-container">

			<div class="logo-container">
				<img src="./assets/3b_logo.png" alt="3BInfra Logo" class="logo">
			</div>

			<div class="navbar">

				<div class="navbar-translations-number">
					{{number_of_translations}}
				</div>

				<div class="navbar-toolkit">
					<ph-plus :size="40" color="#7eb81b" weight="duotone" class="clickable"
						@click="addDialogState = true" />
					<ph-pencil :size="40" color="#7eb81b" weight="duotone" class="clickable"
						@click="editDialogState = true" />
					<ph-trash :size="40" color="#7eb81b" weight="duotone" class="clickable"
						@click="delDialogState = true" />
				</div>

			</div>
		</div>

		<div class="main">

			<GDialog v-model="delDialogState">

				<div class="dialog">
					<p>Are you sure you want to delete the translation?</p>
					<div class="button-container">
						<button @click="toggleDel()" class="button red">Yes</button>
						<button @click="delDialogState = false" class="button green">No</button>
					</div>
				</div>

			</GDialog>

			<GDialog v-model="addDialogState">
				<Add @added="added()" />
			</GDialog>

			<GDialog v-model="editDialogState">
				<Edit :slovak="translation.slovak" :english="translation.english" :german="translation.german"
					:to-edit="translation.id" @edited="wasEdited()" />
			</GDialog>

			<div class="translation-container">

				<div class="translation">
					<div class="translation-header">
						SLOVAK
					</div>
					<div class="translation-input">
						<input type="text" name="" id="" class="translation-form" v-model="translation.slovak"
							@keyup.enter="fetch = !fetch" @input="edited = 'SLOVAK'">
					</div>
				</div>

				<div class="translation">
					<div class="translation-header">
						ENGLISH
					</div>
					<div class="translation-input">
						<input type="text" name="" id="" class="translation-form" v-model="translation.english"
							@keyup.enter="fetch = !fetch" @input="edited = 'ENGLISH'">
					</div>
				</div>

				<div class="translation">
					<div class="translation-header">
						GERMAN
					</div>
					<div class="translation-input">
						<input type="text" name="" id="" class="translation-form" v-model="translation.german"
							@keyup.enter="fetch = !fetch" @input="edited = 'GERMAN'">
					</div>
				</div>
			</div>

			<div class="navigation-container">
				<button class="button" @click="page -= 1">
					<ph-caret-double-left :size="32" color="#7eb81b" weight="duotone" />
				</button>
				<div v-if="allHits.length === 0">
					0/0
				</div>
				<div v-else>
					{{page + 1}} / {{numOfHits}}
				</div>
				<button class="button" @click="page += 1">
					<ph-caret-double-right :size="32" color="#7eb81b" weight="duotone" />
				</button>
			</div>

		</div>


	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { TranslationDto, WordDto } from './api/translation';
import { delete_translation, get_translations, get_translation_by_word } from './api/translation_api';
import Add from './components/Add.vue';
import Edit from './components/Edit.vue';

const number_of_translations = ref(0)

onMounted(async () => {
	let data = await get_translations()
	number_of_translations.value = data.length
})

const delDialogState = ref(false)
const addDialogState = ref(false)
const editDialogState = ref(false)

const toast = useToast()

const fetch = ref(false)

const translation = reactive({ slovak: "", german: "", english: "", id: "" })
let allHits = reactive([] as TranslationDto[])
const page = ref(0)
const numOfHits = computed(() => {
	return allHits.length
})

const edited = ref("")

watch([page], () => {

	console.log("Page" + page.value)
	if (page.value < 0) {
		page.value = 0
	}
	if (page.value >= allHits.length) {
		page.value -= 1
	}
})

watch([fetch], async () => {

	// On fetch we want to clear all the hits
	allHits.length = 0

	let input

	if (edited.value == "SLOVAK") {
		input = { language: "SLOVAK", translation: translation.slovak }
	} else if (edited.value == "ENGLISH") {
		input = { language: "ENGLISH", translation: translation.english }
	} else if (edited.value == "GERMAN") {
		input = { language: "GERMAN", translation: translation.german }
	}

	let fetched_data = await get_translation_by_word(input as WordDto)

	for (const translation of fetched_data) {

		if (!allHits.includes(translation)) {
			allHits.push(translation)
		}
	}
})

watch([page, allHits], async () => {

	console.log("allHits changed: " + allHits.length)

	if (allHits.length === 0) {
		return
	}

	const data = allHits[page.value]

	translation.id = data.id

	for (const word of data.words) {
		console.log(word)
		switch (word.language) {
			case "SLOVAK":
				console.log("SLOVAK")
				translation.slovak = word.translation

			case "ENGLISH":
				console.log("ENGLISH")
				translation.english = word.translation

			case "GERMAN":
				console.log("GERMAN")
				translation.german = word.translation
		}
		console.log(word)
	}

})

const toggleDel = async () => {
	delDialogState.value = false

	let deleted = await delete_translation(translation.id)

	if (deleted === true) {

		toast.success("Translation succesfully deleted", {
			timeout: 2500,
		})

		number_of_translations.value = number_of_translations.value - 1
		// Clean up fields
		translation.slovak = ""
		translation.german = ""
		translation.english = ""

		allHits.length = 0
	}

}

const wasEdited = () => {
	editDialogState.value = false
}

const added = () => {
	addDialogState.value = false
	number_of_translations.value += 1
}

</script>

<style scoped>
.logo {
	width: 160px;
	height: 96px;
}

.logo-container {
	display: flex;
	justify-content: center;
	align-items: center;

	position: absolute;
	top: -12.5px;
	left: 10px;

}

.navigation-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.button {
	width: 7rem;
	height: 3.5rem;
	background-color: white;
	border: none;
	margin: 10px;
	cursor: pointer;
	border-radius: 5px;
	transition: all 0.3s ease-in-out;
}

.green {
	color: white;
	border: none;
	background-color: #7eb81b;
}

.green:hover {
	box-shadow: 3px 2px 5px #75aa19;
}

.red {
	color: #F37878;
	border: 1px solid#F37878;

}

.button-container {
	margin-left: 20px;
}

* {
	font-family: 'Montserrat';
}

.container {
	height: 100vh;
	overflow: hidden;
}

.navbar-container {
	display: flex;
	height: 6rem;
	justify-content: center;
}

.navbar {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: white;
	width: 30%;
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}

.navbar-translations-number {
	margin: 10px;
	color: gray;
	font-size: 32px;
	font-style: italic;
}

.navbar-toolkit {
	padding-top: 5px;
}

.clickable {
	cursor: pointer;
}

.dialog {
	width: 100%;
	height: 10rem;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-left: 128px;
}

.main {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 85%;
	align-items: center;
	justify-content: center;
}

.translation-container {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.translation {
	height: 15rem;
	width: 33%;
	background-color: white;
	border-radius: 5px;
	margin: 20px;
	border: none
}

.translation-header {
	margin: 10px;
	font-size: 25px;
	font-style: italic;
	color: gray;
}

.translation-form {
	outline: none;
	border: none;
	transition: all 0.5s ease-in-out;
	height: 100%;
	width: 100%;
	font-size: 5rem;
}
</style>