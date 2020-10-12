export default class SpotlightItem
{
    public element!: HTMLLIElement | null
    private title: string
    private readonly href: string

    constructor(title: string, href: string)
    {
        const li: HTMLLIElement = document.createElement('li')
        const a: HTMLAnchorElement | HTMLLinkElement = document.createElement('a')
        a.setAttribute('href', href)
        a.innerText = title
        li.appendChild(a)
        li.setAttribute('hidden', 'hidden')
        this.element = li
        this.title = title
        this.href = href
        this.hide()
    }

    match(regexp: RegExp): boolean
    {
        const matches: RegExpMatchArray | null = this.title.match(regexp)
        if (matches === null) {
            this.hide()
            return false
        }
        const link = this.element?.firstElementChild as HTMLLinkElement
        link.innerHTML = matches.reduce((acc, match, index) => {
            if (index === 0) {
                return acc
            }
            console.log(this.element?.parentElement)
            return acc + (index % 2 === 0 ? `<mark>${match}</mark>` : match)
        }, '')
        this.element?.removeAttribute('hidden')
        return true
    }

    hide(): void
    {
        this.element?.setAttribute('hidden', 'hidden')
    }

    select(): void
    {
        this.element?.classList.add('bg-black', 'bg-opacity-25')
    }

    unselect(): void
    {
        this.element?.classList.remove('bg-black', 'bg-opacity-25')
    }

    follow(): void
    {
        window.location.href = this.href
    }
}