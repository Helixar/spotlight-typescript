import SpotlightItem from './SpotlightItem'

class Spotlight extends HTMLElement
{

    /*<li><a class="block p-2" href="/">Dashboard</a></li>
    <li class="bg-black bg-opacity-25"><a href="/">Dashboard</a></li>
    <li><a href="/">Dashb<mark class="bg-black text-white">o</mark>ard</a></li>*/
    private input!: HTMLInputElement | null
    private suggestions!: HTMLUListElement | null
    private items!: SpotlightItem[] | null
    private matchedItems!: SpotlightItem[] | null
    private activeItem!: SpotlightItem | null

    constructor()
    {
        super()
        this.onKeyDown = this.onKeyDown.bind(this)
        this.onInputKeyDown = this.onInputKeyDown.bind(this)
        this.onInput = this.onInput.bind(this)
        this.hide = this.hide.bind(this)
        this.show = this.show.bind(this)
    }

    connectedCallback()
    {
        this.classList.add('fixed', 'top-0', 'right-0', 'bottom-0', 'left-0', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center')
        this.hide()
        this.innerHTML = `
            <div class="w-2/5 bg-white relative rounded-md p-2">
                <input type="text" class="w-full p-2 border">
                <ul class="absolute left-0 right-0 top-auto bg-white rounded-b-md p-2" data-spotlight-suggestions hidden>
                </ul>
            </div>
        `
        this.input = this.querySelector('input')
        this.input?.addEventListener('blur', this.hide)
        this.suggestions = this.querySelector('ul[data-spotlight-suggestions]') as HTMLUListElement
        const targetAttrbute = this.getAttribute('target') as string
        const links: Array<HTMLLinkElement> = Array.from(document.querySelectorAll(targetAttrbute))
        this.createSuggestions(links)
        window.addEventListener('keydown', this.onKeyDown)
        this.input?.addEventListener('input', this.onInput)
        this.input?.addEventListener('keydown', this.onInputKeyDown)
    }

    disconnectedCallback(): void
    {
        window.removeEventListener('keydown', this.onKeyDown)
    }

    private createSuggestions(links: Array<HTMLLinkElement>): void
    {
        this.items = links.map((a: HTMLLinkElement) => {
            if (a.innerText === '') return
            const item: SpotlightItem = new SpotlightItem(a.innerText.trim(), a.getAttribute('href') as string)
            this.suggestions?.appendChild(item.element as HTMLLIElement)
            return item
        }).filter(element => element !== null) as SpotlightItem[]
    }

    private hide(): void
    {
        this.classList.remove('opacity-100', 'pointer-events-auto')
        this.classList.add('opacity-0', 'pointer-events-none')
    }

    private show(): void
    {
        this.classList.remove('opacity-0', 'pointer-events-none')
        this.classList.add('opacity-100', 'pointer-events-auto', 'duration-200')
    }

    private onInput(): void
    {
        const search = this.input?.value.trim() as string
        if (search === '') {
            this.items?.forEach(item => item.hide())
            this.matchedItems = []
            this.suggestions?.setAttribute('hidden', 'hidden')
            return
        }
        let regexp = '^(.*)'
        for (const i in search as any) {
            if (search.hasOwnProperty(i)) {
                regexp += `(${search[i as unknown as number]})(.*)`
            }
        }
        regexp += '$'
        this.matchedItems = this.items?.filter((item: SpotlightItem) => item.match(new RegExp(regexp, 'i'))) as SpotlightItem[]
        if (this.matchedItems.length > 0) {
            this.suggestions?.removeAttribute('hidden')
            this.setActiveIndex(0)
        } else {
            this.suggestions?.setAttribute('hidden', 'hidden')
        }
    }

    private onInputKeyDown(e: KeyboardEvent): void
    {
        if (e.key === 'Escape' && document.activeElement === this.input) {
            this.input?.blur()
        } else if (e.key === 'ArrowDown') {
            const index: number = this.matchedItems?.findIndex(element => element === this.activeItem) as number
            this.setActiveIndex(index + 1)
        } else if (e.key === 'ArrowUp') {
            const index: number = this.matchedItems?.findIndex(element => element === this.activeItem) as number
            this.setActiveIndex(index - 1)
        } else if (e.key === 'Enter') {
            this.activeItem?.follow()
        }
    }

    private onKeyDown(e: KeyboardEvent): void
    {
        if (e.key === 'k' && e.ctrlKey) {
            e.preventDefault()
            const input = this.input as HTMLInputElement
            this.classList.add('opacity-100', 'pointer-events-auto')
            input.value = ''
            this.onInput()
            input.focus()
        }
    }

    private setActiveIndex(number: number): void
    {
        const items = this.matchedItems as SpotlightItem[]
        if (this.activeItem) {
            this.activeItem.unselect()
        }
        if (number >= items.length) {
            number = 0
        }
        if (number < 0) {
            number = items.length - 1
        }
        items[number].select()
        this.activeItem = items[number]
    }
}

customElements.define('spotlight-menu', Spotlight)