var fnAll={
	//只找到指定id的下一子集
	getChilds(data,id){
		return data.filter(function(a){
			return a.pid==id;
		})
	},
	//通过id找自己
	getSelf(data,id){
		return data.find(function(a){
			return a.id==id;
		})
	},
	//通过id找所有父级，并且存在数组里
	getParents(data,id){
		var arr=[];
		var obj=fnAll.getSelf(data,id)
		if(obj){
			arr.push(obj);
			arr=arr.concat(fnAll.getParents(data,obj.pid))
		}
		return arr;
	},
	//在指定id的所有的子数据中，是否存在某一个title
	// 存在 true
	// 不存在 false
	isTitleExist(data,value,id){
		var childs = fnAll.getChilds(data,id);  //先找到指定id的下一所有子级
		return childs.findIndex(function(item){
			return item.title === value;
		}) !== -1;
	},
	//通过id找到所有子集
	getChildsAll(data,id){
		var arr=[];
		var self=fnAll.getSelf(data,id);
		arr.push(self);
		var childs=fnAll.getChilds(data,self.id);
		childs.forEach(function(a){
			arr=arr.concat(fnAll.getChildsAll(data,a.id))
		})
		return arr;
	},
	//通过id数组找到所有子集
	getChildsAllByIdArr(data,idArr){
		var arr=[];
		idArr.forEach(function(a){
			arr=arr.concat(fnAll.getChildsAll(data,a))
		})
		return arr;
	},
	//通过id数组删除所有子集
	deleteChildsAllByIdArr(data,idArr){
		var childsAll = fnAll.getChildsAllByIdArr(data,idArr);
		//循环data，拿到data的每一项，跟childsAll每一项对比
		for( var i = 0; i < data.length; i++ ){
			for( var j = 0; j < childsAll.length; j++ ){
				if( data[i] === childsAll[j] ){
					data.splice(i,1);
					i--;
					break;
				}
			}
		}
	}
}
