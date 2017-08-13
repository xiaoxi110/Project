(function(){
	//==============================可视区的高随着可视区的高变化而变化==============================================
	var head = document.querySelector(".head");
	var content = document.querySelector(".content");
	function resize(){
		content.style.height = t.view().h - head.offsetHeight + "px";
	}
	resize();
	window.onresize = resize;
	//================================渲染各个区域============================================================
	//准备数据
	var datas = data.files;
	//1.左侧菜单区域
	function getTreeById(id){//根据id获取相应的菜单项
		var treeTitle = bleft.querySelectorAll(".tree");
		for(var i=0; i<treeTitle.length; i++){
			if(treeTitle[i].dataset.id == id){
				return treeTitle[i];
			}
		}
	}
	var bleft = document.querySelector(".bleft");
	bleft.innerHTML = createTreeMenu(datas, -1);
	
	//2.右侧导航区域
	var brtop = document.querySelector(".brtop");
	var nav = document.querySelector(".nav");
	nav.innerHTML = createNavHtml(datas, 0);
	t.addClass(getTreeById(0),"treenav");//初始化树形菜单是被选取的
	
	//3、生成文件区域
	var brbot = document.querySelector(".brbot");
	brbot.innerHTML = createFileHtml(datas, 0);
	//============================================渲染文件的公共方法===========================
	function render(fileid){
		t.removeClass(getTreeById(currentId),"treenav");
		t.addClass(getTreeById(fileid),"treenav");
		//渲染导航区域
		nav.innerHTML = createNavHtml(datas, fileid);
		//渲染文件区域
		var ch = handle.findChildsById(datas, fileid);
		brbot.innerHTML = createFileHtml(datas, fileid);
		if(ch.length){
			nonfile.style.display = "none";
		}else{
			nonfile.style.display = "block";
		}
		t.removeClass(allCheck, "checked");
	}
	
	function isExist(datas, inpname, curid){
		var childs = handle.findChildsById(datas, curid);
		return !!childs.find(function(item){
			return item.title === inpname;
		});
	}
	//==================================提醒==============================
	var tips = document.querySelector(".tips");
	var tiptext = document.querySelector(".tiptext");
	function tipsfn(classname, val){
		//先拉倒-70px 在过渡到0
		tips.style.transition = "none";
		tips.style.top = "-70px";
		tips.className = "tips";

		setTimeout(function (){
			t.addClass(tips,classname);
			tips.style.transition = ".3s";
			tips.style.top = "0";	
		},0)

		tiptext.innerHTML = val;

		//延时上去的定时器只能有一个
		clearTimeout(tips.timer);
		tips.timer = setTimeout(function (){
			tips.style.top = "-70px";
		},2000);	
	}
	//===============================================为每个区域添加交互===========================
	//1、点击左侧树形菜单区域
	
	var nonfile = document.querySelector(".non-file");
	
	var currentId = 0;
	
	//利用事件委托给左边菜单区域添加处理函数//注意这两个点击函数的顺序不可以交换，因为如果交换，就会重新渲染，找不到指定的元素
	t.on(bleft, "click", function(e){
		var target = e.target;
		
		if(target = t.parent(target, ".tree")){
			var fileid = target.dataset.id;
			render(fileid);
			currentId = fileid;
		}
	});
	
	//2.点击导航区域
	t.on(nav, "click", function(e){
		var target = e.target;
		
		if(target.nodeName.toLowerCase() === "strong"){
			var fileid = target.dataset.id;
			render(fileid);
			currentId = fileid;
		}
	});
	
	//3、点击文件区域,进入文件下一级

	var checkboxs = brbot.getElementsByClassName("brbcheck");//动态获取
	var files = brbot.getElementsByClassName("files");//动态获取
	var allCheck = brtop.getElementsByClassName("boxcheck")[0];//动态获取
	//点击小框框，多选
	t.on(brbot, "click", function(e){
		var target = e.target;
		if(target = t.parent(target, ".brbcheck")){//当点击的是小框框的时候
			t.toggleClass(target, "checked");
		}
		
		var bl = Array.from(checkboxs).every(function(item){//如果所有的小框框都是checked那么就勾选全选
			return t.hasClass(item, "checked");
		});
		
		if(!files.length){
			bl = false;
		}
		
		if(bl){
			t.addClass(allCheck,"checked");
		}else{
			t.removeClass(allCheck,"checked");
		}
	});
	//点击全选项，文件被全选
	t.on(allCheck, "click", function(e){
		var target = e.target;
		var childs = handle.findChildsById(datas, currentId);
		if(!childs.length) return;//子集为空
		var bl = t.toggleClass(target, "checked");
		
		Array.from(checkboxs).forEach(function(val, index){
			if(bl){
				t.addClass(files[index], "chose");
				t.addClass(val, "checked");
			}else{
				t.removeClass(files[index], "chose");
				t.removeClass(val, "checked");
			}
		});
		
	});
////点击文件进去
	t.on(brbot, "click", function(e){
		var target = e.target;
		if(t.parent(target, ".brbcheck") || t.parent(target, ".inp")){//当点击的是小框框的时候
			return;
		}
		
		if(target = t.parent(target, ".files")){
			var divid = target.dataset.id;
			render(divid);
			currentId = divid;
		}
	});
	
	t.on(brbot, "mousedown", function(e){
		var target = e.target;
		if(t.parent(target, ".inp")){
			e.stopPropagation();
		}
	});
	//========================文件区鼠标移入========================
	t.on(brbot,"mouseover",function(e){
		var target = e.target;
		if(target = t.parent(target, ".files")){
			t.addClass(target, "chose");
		}
	});
	
	t.on(brbot,"mouseout",function(e){
		var target = e.target;
		if(target = t.parent(target, ".files")){
			var box = target.querySelector(".brbcheck");
			if(!t.hasClass(box, "checked")){
				t.removeClass(target, "chose");
			}
		}
	});
	//===============================新建添加文件夹=================================
	var create = document.querySelector(".create");
	t.on(create, "mouseup", function(){//当鼠标在创建上抬起的时候，生成结构
		var newfile = createFile();//新建文件夹
		nonfile.style.display = "none";//让显示背景消失
		
		var inpt  = newfile.querySelector(".inpt");
		var inp  = newfile.querySelector(".inp");

		inp.style.display = "block";
		inpt.style.display = "none";
		
		brbot.insertBefore(newfile ,files[0]);	
		
		inp.focus();//获得焦点
		
		create.isCreate = true;//处于创建元素的情况下
	})
	
	t.on(document, "mousedown", madeFile);//当鼠标在document上按下的时候，判断
	t.on(document, "keyup", function(e){
		if(e.keyCode === 13){
			madeFile();
		}
	});
	
	function madeFile(){
		if(!create.isCreate) return;
		
		var fistChild = brbot.firstElementChild;//处于创建元素的情况下，第一个元素，即是新创建的节点
		var inp  = fistChild.querySelector(".inp");
		var inpt  = fistChild.querySelector(".inpt");
		
		var tit = inp.value.trim();
		
		if(tit){//如果文件命名不为空
			if(isExist(datas, tit, currentId)){//检测命名是否重复,如果命名重复，就删除
				tipsfn("fail", "命名冲突！！！");
				brbot.removeChild(fistChild);
			}else{//若不存在则插入数据
				tipsfn("ok", "创建成功！");
				var id = parseInt(Math.random()*1000);
				datas.unshift({//因为js中的数据的引用是地址的引用，因此data和datas的插入数据的效果是一样的
					id: id,
					pid: currentId,
					title: tit,
					type:"file"
				});
				
				fistChild.setAttribute("data-id",id);
				bleft.innerHTML = createTreeMenu(datas, -1);
				
				inpt.innerHTML = tit;
				inp.style.display = "none";
				inpt.style.display = "block";
				
				//创建成功后，让所有的小框框都取消掉小钩钩
				whoSelect().forEach(function(item){//被选择的文件们
					t.removeClass(item, "chose");
					
					var ch = item.querySelector(".brbcheck");
					t.removeClass(ch, "checked");
				});
				
				t.removeClass(allCheck, "checked");//全选
				
			}
		}else{//如果输入的是空，或者全是空格的话，就删除节点
			brbot.removeChild(fistChild);
		}
		create.isCreate = false;
	}
//===========================删除文件夹=====================================
	var remove = document.querySelector(".remove");
	
	function whoSelect(){//返回被选的文件的id组成的数组
	
		return Array.from(checkboxs).filter(function(val){
			return t.hasClass(val, "checked");//找到被勾选的checkbox
		}).map(function(item){
			return t.parent(item,".files");//取其对应的父级的id
		});
		
	}
	
	t.on(remove, "click", function(){
		
		var idArr = whoSelect();//被选择的ID组成的数组
		
		if(idArr.length){
			win.setSmallwin({
					title: "",
					content:"<i class='del'></i><div class='qes clearfix'><div class='titl'>确定要删除这个文件夹吗？</div><div class='cont'>已删除文件可以在回收站中找到</div></div>",
					ifmove: true,
					okfn:function(){
						idArr = idArr.map(function(item){
							return item.dataset.id;
						});
						
						handle.deleteAllChildsByArr(datas, idArr);//删除选中的元素
						//从新渲染
						render(currentId);
						bleft.innerHTML = createTreeMenu(datas, -1);
					}
			});
		}else{
			tipsfn("warn", "请选择文件夹！");
		}
		
		
	});
	//============================移动到文件夹================================
	var move = document.querySelector(".move");

	t.on(move, "click", function(){
		
		var toClose = true;//默认为true，没选任何一个目录，不能点击确认按钮关闭弹窗
		var desObj = null;//点击的要移入的文件夹的ID
		var lastclick = null;//上一个点击的对象
		var selArr = [];//被选中的元素及其子孙元素
		var selObj = whoSelect();
		
		var selIdArr = selObj.map(function(val){//将选中元素对应的id放在selArr中
			return val.dataset.id;
		});
		
		selArr = handle.findAllChildsByArr(datas, selIdArr)//将当前选中元素和其子孙元素在data中对应对的数据存在selArr中

		if(selArr.length){ //在选择了文件夹的时候	
			win.setSmallwin({//弹框
				title:"选择存储为位置",
				content:"<div class='mtit'>wenjian</div><div class='conte'><div class='treelist'>"+createTreeMenu(datas, -1)+"</div></div><p class='tipmes'></p>",
				ifmove: true,
				okfn:function(){
					if(toClose){//当时true时，点击确定来关闭弹框
						return true;
					}else{
						//命名冲突
						var onoff = false;//没有同名的文件夹
						
						selIdArr.forEach(function(val,ind){
							var self = handle.findSelfById(datas, val);
							
							var bl = isExist(datas, self.title, desObj.id);//检查元素的title是否存在于目的问价夹中
							
							if(bl){//若有一个元素与将要移入的文件夹下的元素重名
								onoff = true;
							}else{
								self.pid = desObj.id;//修改数据
								brbot.removeChild(selObj[ind]);//从页面显示中删除
							}
						});
						
						if(onoff){
							tipsfn("warn", "含有同名文件，部分文件移动失败！");
						}
						
						bleft.innerHTML = createTreeMenu(datas, -1);//从新渲染左侧菜单区域
						if(!brbot.innerHTML){
							nonfile.style.display = "block";
						}else{
							nonfile.style.display = "none";
						}
						
						return false;
					}
				}
			});
			
			//初始化元素高亮
			var firstTree = tanbox.querySelectorAll(".tree")[0];
			t.addClass(firstTree,"treenav"); 
			lastclick = firstTree;
			
			//改变文件信息
			var mtit = tanbox.querySelector(".mtit");
			mtit.innerHTML = selArr[0].title;
			
			//为框里的元素添加点击事件处理函数
			var treelist = tanbox.querySelector(".treelist");
			
			var tipmes = tanbox.querySelector(".tipmes");//提示信息
			
			t.on(treelist, "click", function(e){//为框里的元素添加点击事件处理函数
				var target = e.target;
				
				if(target = t.parent(target, ".tree")){
					desObj =  handle.findSelfById(datas, target.dataset.id);//被点击目标文件
					
					t.removeClass(lastclick,"treenav"); 
					t.addClass(target,"treenav"); 
					lastclick = target;
					
					//情况一、当被选择的元素在被点击的文件目录下
					var bl = selArr.find(function(val){
						return val === desObj;
					});
					
					if(bl){//当被选择的元素在被点击的文件目录
						tipmes.innerHTML = "不能将文件移动到自身或其子目录下！";
						toClose = true;
					}else{
						tipmes.innerHTML = "";
						toClose = false;
					}
					
					//情况二、被点击的文件夹是当前被选元素的父级
					if(desObj === handle.findSelfById(datas, selArr[0].pid)){
						tipmes.innerHTML = "不能移动到他的子集元素中！";
						toClose = true;
					}
					
				}
				
			});
		
			
			
		}else{//没有选中元素
			tipsfn("warn" ,"请选择文件夹！");
		}	
	});
	
	//==============================重命名文件夹==============================
	var rename = document.querySelector(".rename");
	var arr = [];
	rename.isRename = false;
	
	t.on(rename, "click", function(){
		arr = whoSelect();
		if(arr.length < 1){
			tipsfn("warn", "请选择文件夹！");
		}else if(arr.length > 1){
			tipsfn("warn", "重命名只能一次针对一个文件夹！");
		}else{
			rename.isRename = true;
			
			arr[0].querySelector(".inpt").style.display = "none";
			var inp = arr[0].querySelector(".inp");
			inp.style.display = "block";
			inp.value = arr[0].querySelector(".inpt").innerHTML;
			
			inp.select();//全部选中
			inp.focus();
		}
	});
	
	t.on(document, "mousedown", function(e){
		
		if(!rename.isRename){//不是重命名状态
			return;	
		}
		
		var vall = arr[0].querySelector(".inp").value.trim();
		
		if(vall === arr[0].querySelector(".inpt").innerHTML){//修改后的名字和原来的名字一样的时候
			
		}else if(isExist(datas, vall, currentId)){//重命名已经存在
			tipsfn("warn", "含有同名文件夹,命名失败!");
			
		}else if(!vall){//命名是空或者空字符串
			
			tipsfn("warn", "命名不可以为空或全是空格符!");
		}else{
			arr[0].querySelector(".inpt").innerHTML = vall;
			
			var id = arr[0].dataset.id;
			handle.findSelfById(datas, id).title = vall;//提交数据
			
			bleft.innerHTML = createTreeMenu(datas, -1);//重新渲染
			
			tipsfn("ok", "命名成功!");//弹框设置
		}
		    
		arr[0].querySelector(".inp").style.display = "none";
		arr[0].querySelector(".inpt").style.display = "block";
		
		t.removeClass(arr[0], "chose");
		t.removeClass(arr[0].querySelector(".brbcheck"), "checked");//去掉小钩钩
		
		rename.isRename = false;//状态重置
	});
	//=============================框选=====================================
	var div = null,
		oriX = null,
		oriY = null,
		pokeface = null,//鼠标下为防止移动时抬起进入的隐形的DIV
		moveBox = null,//跟着鼠标移动的小小鼻涕虫
		pengFile = null;//被碰撞的文件夹
	t.on(document, "mousedown", function(e){
		
		if(e.which != 1) 	return;//右键按下没反应
		e.preventDefault();
		
		var target = e.target;
		
		if(!t.parent(target, ".brbot")){
			return;
		}
		
		var isChecked = false;
		if(t.parent(target, ".files")){//如果点击的是单个文件，那么他根据自身下面的checkbox是否被选取，若被选取将被拖拽
			isChecked = !!t.parent(target, ".files").querySelector(".checked");
		}
		
		//点击的不是文件元素的时候
			
    	oriX = e.clientX;
    	oriY = e.clientY;
    	
    	document.onmousemove = function(e){
    		
    		if(isChecked){//如果在被选中元素身上移动
    			var checkedDiv = whoSelect();
    			
    			if(!moveBox){//生成小鼻涕虫
    				moveBox = document.createElement("div");
	    			moveBox.className = "dragme";
	    			moveBox.innerHTML = `<img src="img/dragbox.png"/><i class="cnum">${checkedDiv.length}</i>`;
					document.body.appendChild(moveBox); 
					
					pokeface = document.createElement("div");
					pokeface.style.cssText =   `width: 10px;
		        								height: 10px;
		        								background: red;
		        								position: absolute;
		        								left:0;
		        								top:0;
		        								opacity: 0`;
					document.body.appendChild(pokeface); 
					
    			}
    			
    			moveBox.style.left = e.clientX + 15 + "px";
				moveBox.style.top = e.clientY + 15 + "px";
				
				pokeface.style.left = e.clientX - 5 + "px";
				pokeface.style.top = e.clientY - 5 + "px";
				
				pengFile = null;
				
				a:for(var i=0; i<files.length; i++){
					
					for(var j=0; j<checkedDiv.length; j++){
						if(checkedDiv[j] === files[i]){
							continue a;
						}
					}
					
					if(peng(pokeface,files[i])){
						t.addClass(files[i], "chose");
						pengFile = files[i];
					}else{
						t.removeClass(files[i], "chose");
					}
				}
				
    			return;
    		}
    		
    		if(Math.abs( e.clientX - oriX )>15 || Math.abs( e.clientY - oriY )>15){
    			if(!div){//如果div为null
	    			div = document.createElement("div");
			    	div.className = "dragbox";
			    	document.body.appendChild(div);
	    		}
	    		
	    		div.style.width = Math.abs( e.clientX - oriX ) + "px";
	    		div.style.height = Math.abs( e.clientY - oriY ) + "px";
	    		div.style.left = Math.min( e.clientX-1 , oriX+1) + "px";//让元素在选框上，使得元素不是在文件上点下和抬起
	    		div.style.top = Math.min(  e.clientY-1 , oriY+1) + "px";//让元素在选框上，使得元素不是在文件上点下和抬起
	    		
	    		var divs = files;
	    		
	    		for (var i = 0; i < divs.length; i++) {//让div和每一个li进行碰撞检测
	    			if( peng(div,divs[i]) ){//碰到
	    				t.addClass(divs[i], "chose");
	    				t.addClass(checkboxs[i],"checked");
	    				divs[i].isSelected = true;
	    			}else{
	    				t.removeClass(divs[i], "chose");
	    				t.removeClass(checkboxs[i],"checked");
	    				divs[i].isSelected = false;
	    			}
	    		}
	    		
//		    		var bl = Array.from(checkboxs).every(function(val){
//		    			return t.hasClass(val, "checked");
//		    		});
//		    		
//		    		if(bl){
//		    			t.addClass(allCheck, "checked");
//		    		}else{
//		    			t.removeClass(allCheck, "checked");
//		    		}

				var arrSel = whoSelect();//老师的方法，貌似比我的简便一些
				if(checkboxs.length!=0 && arrSel.length === checkboxs.length){//当文件夹为空的时候禁用选框
					t.addClass(allCheck, "checked");
				}else{
					t.removeClass(allCheck, "checked");
				}
				
	    		return false;
    		}	
    	}
	    	
    	document.onmouseup = function(){
    		document.onmousemove = null;
    		document.onmouseup = null;//专函数，专用，用完清空防止混乱
    		
    		if(div){
    			document.body.removeChild( div );
    			div = null;
    		}
    		
    		if(moveBox){
    			document.body.removeChild( moveBox );
    			moveBox = null;
    			
    			document.body.removeChild( pokeface );
    			pokeface = null;
    		}
    		
    		if( pengFile ){
    			var checkedD = whoSelect();
    			var selIdArr = whoSelect().map(function(val){
    				return val.dataset.id;
    			});
    			
    			var pengId = pengFile.dataset.id;
    			
    			//命名冲突
				var onoff = false;//没有同名的文件夹
				
				selIdArr.forEach(function(val,ind){
					var self = handle.findSelfById(datas, val);
					
					var bl = isExist(datas, self.title, pengId);//检查元素的title是否存在于目的问价夹中
					
					if(bl){//若有一个元素与将要移入的文件夹下的元素重名
						onoff = true;
					}else{
						self.pid = pengId;//修改数据
						brbot.removeChild(checkedD[ind]);//从页面显示中删除
					}
				});
				
				if(onoff){
					tipsfn("warn", "含有同名文件，部分文件移动失败！");
				}
				
				bleft.innerHTML = createTreeMenu(datas, -1);//从新渲染左侧菜单区域
				if(!brbot.innerHTML){
					nonfile.style.display = "block";
				}else{
					nonfile.style.display = "none";
				}
				
				//释放一下变量，目的是移动之后，不要再up后再次出发移动的判断
				pengFile = null;
			}
    		
	    }	
	    function peng(obj1,obj2){//返回结果如果为true，说明碰到
	    	var pos1 = obj1.getBoundingClientRect();
	    	var pos2 = obj2.getBoundingClientRect();
	    	
	    	return pos1.right > pos2.left && pos1.left < pos2.right && pos1.bottom > pos2.top && pos1.top < pos2.bottom;
	    }
	    
});
})()