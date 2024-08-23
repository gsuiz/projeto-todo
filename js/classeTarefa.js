import { quantityTask,optionsTask } from "./main.js"

class Tarefas{
    constructor(){
        this.todas = []
        this.ativas = []
        this.completas = []
        this.boxTask = document.querySelector(".box-task__items")
        this.boxTaskChildren = Array.from(this.boxTask.children)
        this.semTarefa = document.querySelector("#no-task")
    }
    
    #adicionarTaskEstado(tasks, text){
        this.boxTask.replaceChildren()
        if(tasks.length !== 0){
            tasks.forEach(item => {
                this.boxTask.appendChild(item)
            })
        } else {
            this.semTarefa.innerHTML = `<h3 class=content__noTask>${text}</h3>`
            this.boxTask.appendChild(this.semTarefa)
        }   
    }

    #mostrarMensagemSemTarefa(){
        const stateTask = Array.from(optionsTask)
            .find(item => item.classList.contains("list__selected")).innerHTML
        const messagesStateTask = {
            All:"There are no tasks here!",
            Active:"There are no active tasks!",
            Completed:"There are no completed tasks!"
        }

        this.semTarefa.innerHTML = `<h3 class=content__noTask>${messagesStateTask[stateTask]}</h3>`
        this.boxTask.appendChild(this.semTarefa)
    }

    reorganizarTarefas(newTaskOrder){
        const state = document.querySelector(".list__selected")
        state.innerHTML === "All" ? this.todas = newTaskOrder: null
        state.innerHTML === "Active" ? this.ativas = newTaskOrder.filter(item => this.ativas.includes(item)) : null
        state.innerHTML === "Completed" ? this.completas = newTaskOrder.filter(item => this.completas.includes(item)) : null
    }

    adicionar(nome){       
        this.boxTaskChildren = Array.from(this.boxTask.children)
        if(this.boxTaskChildren.includes(this.semTarefa)){
            this.boxTask.removeChild(this.semTarefa) 
        } 

        const nomeNormalizado = nome.trim().toLowerCase()
        if(!this.todas.some(item => item.innerText.trim().toLowerCase() == nomeNormalizado) || this.boxTask.length === 0){
            this.boxTask.innerHTML += `
            <div class="items__content" draggable="true">
                <div class="content__taskname">
                    <input type="checkbox" id="check">
                    <label for="check" class="taskname__check"><i class="fa-solid fa-check"></i></label>
                    <label for="check">${nome}</label>
                </div>
                <i class="fa-solid fa-xmark content__delete"></i>
            </div>
                    `

            if(this.todas === Array.from(this.boxTask.children)){
                this.todas = Array.from(this.boxTask.children)
            } else {
                this.todas.push(this.boxTask.lastElementChild)
            }
            this.ativas.push(this.boxTask.lastElementChild)
            quantityTask()
        }
    }

    remover(element){
        this.ativas = this.ativas.filter(item => item.textContent != element.textContent)
        this.todas = this.todas.filter(item => item.textContent != element.textContent)
        this.completas = this.completas.filter(item => item.textContent != element.textContent)

        element.remove()
        if(this.boxTask.children.length === 0){
            this.#mostrarMensagemSemTarefa()
        }

        quantityTask()
    }

    limpar(){
        this.completas = []
        this.ativas = []
        this.todas = []
        this.boxTask.innerHTML = ""
        this.#mostrarMensagemSemTarefa()
        quantityTask()
    }

    marcarConcluida(element){
        const parent = element.parentNode.parentNode
        const parentTodas = this.todas.find(item => item.textContent == parent.textContent)

        if(element.classList.contains("concluded")){
            parentTodas.children[0].children[1].classList.add("concluded")
            this.ativas = this.ativas.filter(item => item.textContent != parent.textContent)
            this.completas.push(parent)
        } else {
            parentTodas.children[0].children[1].classList.remove("concluded")
            this.completas = this.completas.filter(item => item.textContent != parent.textContent)
            this.ativas.push(parent)
        }
    }

    selecionarEstadoTask(element){
        if(element.innerHTML === "All"){
            this.#adicionarTaskEstado(this.todas, "There are no tasks here!")
        } else if(element.innerHTML === "Active"){
            this.#adicionarTaskEstado(this.ativas, "There are no active tasks!")
        } else if(element.innerHTML === "Completed"){
            this.#adicionarTaskEstado(this.completas, "There are no completed tasks!")
        }
    }
}


export default new Tarefas()