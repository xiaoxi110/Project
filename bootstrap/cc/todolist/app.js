/*
new Vue({
	el: todoapp,
	data: {items: list},
	methods: {
		blurfn(val){
			console.log(val)
		}
	}
});
 * 新建对象，el是模板，data是托管的数据，methods是事件的处理函数，directives:选项对象，存放自定义属性。
 * v-bind:响应式的数据绑定。
 * v-if:条件渲染；
 * v-for:循环.
 * v-on:事件监听器。
 * v-model 指令，它能轻松实现表单输入和应用状态之间的双向绑定
 * 事件对象需要手动的传到函数中，作为他的参数v-on:click = addTodo(data,$event)
 * v-on:click = addTodo() 这种情况是第一个参数是事件对象。
 * 条件渲染：v-show = "表达式值"；
 * v-if
 * 添加class 	v-bind:class{className: "条件"}
 * 
 */


//var list = [
//	{
//		id:1,
//		title:"html/css/js",
//		isSelected:false   //是否这条数据是选中的
//	},
//	{
//		id:2,
//		title:"jquery/bootstrap/vue",
//		isSelected:false
//	},
//	{
//		id:3,
//		title:"webpack",
//		isSelected:false
//	}
//];

var todoapp = document.querySelector(".todoapp");

var store = {
	savestroe: function(key, val){
		localStorage.setItem(key, JSON.stringify(val));	//把数组变成json格式的
	},
	getstroe:function(key){
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}

var list = store.getstroe("cxx");

var filter = {
	"all": function(list){
		return list;
	},
	"done":function(list){
		return list.filter(function(val){
			return val.isSelected == true;
		});
	},
	"undone":function(list){
		return list.filter(function(val){
			return val.isSelected == false;
		});
	}
}

var vm = new Vue({
	el: todoapp,
	data: { items: list,
			todos: "",
			allChecke: false,
			itemtodo: "",
			oldtitle: "",
			visibility: "all"
		},
	watch:{
		items: {
			handler: function(){
				store.savestroe("cxx", this.items);
			},
			deep: true
		}
	},
	computed:{
		noCheckednum: function(){
			return this.items.filter(function(val){
				return val.isSelected === false;
			}).length;
		},
		filteredList: function(){
			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	},
	methods: {
		keyupFn(val){//添加代办事项
			if(this.todos.trim()){
				this.items.push({
					id:this.items.length,
					title: this.todos,
					isSelected:false
				});
			}
			this.todos = "";
		},
		toggleFn(val){//点击checkbox
			val.isSelected = !val.isSelected;
		},
		destroyFn(val){//点击小叉叉删除当前这项
			var index = this.items.indexOf(val);
			this.items.splice(index,1);
		},
		allFn(){//点击全选
			if(this.allChecke){
				for(var i=0; i<this.items.length; i++){
					this.items[i].isSelected = false;
				}
			}else{
				for(var i=0; i<this.items.length; i++){
					this.items[i].isSelected = true;
				}
			}
			this.allChecke = !this.allChecke;
		},
		editFn(val){//点击进入编辑
			this.oldtitle = val.title;
			this.itemtodo = val;
		},
		cancletodo(val){
			val.title = this.oldtitle;
			this.itemtodo = "";
		},
		saveFn(val){//编辑完成后
			if(!val.title.trim()){
				val.title = this.oldtitle;
			}
			this.itemtodo = "";
		}
	},
	directives:{
		"focus":{
			update(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

function watchHashChange(){
	var hash = window.location.hash.slice(1);

	vm.visibility = hash;
	
}

watchHashChange();

window.addEventListener("hashchange",watchHashChange);