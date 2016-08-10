var Comment=React.createClass({
	rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

    render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});
var Cmtlist=React.createClass({
	render:function(){
		var commentNodes=this.props.data.map(function(asd){
			return (<Comment author={asd.author}>
			{asd.text}</Comment>)
		});
		return (<div className='commentList'>{commentNodes}</div>)
	}
});

var Cmtform=React.createClass({
	handleSubmit:function(e){
        e.preventDefault();
        var author = this.refs.author.value.trim();
	    var text = this.refs.text.value.trim();
	    if (!text || !author) {
	      return;
	    }
	    // TODO: send request to the server
	    this.props.onCommentSubmit({author: author, text: text});
	    this.refs.author.value = '';
	    this.refs.text.value = '';
	    return;
	},
	render:function(){
		return (

	      <form className="commentForm" onSubmit={this.handleSubmit}>
	      <h3>表单</h3>
	        <input type="text" placeholder="名字" ref='author'/>
	        <input type="text" placeholder="说点什么" ref='text' />
	        <input type="submit" value="提交表单" />
	      </form>
        );
	}
		
})
var CmtBox=React.createClass({
    loadCommentsFromServer: function() {
	    $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      cache: false,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	  },
	getInitialState: function() {
	    return {data: []};
	  },
	handleCommentSubmit:function(comment){
        //todo:表单提交到服务器并刷新列表
        $.ajax({
	      url: this.props.url,
	      dataType: 'json',
	      type: 'POST',
	      data: comment,
	      success: function(data) {
	        this.setState({data: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},  

	componentDidMount: function() {
	    this.loadCommentsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	  },

	render:function(){
		return (<div className="commentbox">
            <h3>我是一个评论框</h3>
            <Cmtlist data={this.state.data}/>
            <Cmtform onCommentSubmit={this.handleCommentSubmit}/>
		 </div>)
	}
});
ReactDOM.render(<CmtBox url="/api/comments" pullInterval={2000}></CmtBox>,document.querySelector('#content'))


