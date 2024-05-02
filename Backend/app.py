from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from sqlalchemy import Engine

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SECRET_KEY'] = 'ASE_Blog'
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    security_question = db.Column(db.String(200), nullable=False)
    security_answer = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='user')  # Default role is 'user'

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(100),nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user = User(
        username=data['username'], 
        password=data['password'], 
        security_question=data['security_question'],
        security_answer=data['security_answer'],
        role=data.get('role', 'user')  # Default role is 'user' if not provided
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/api/login', methods=['POST'])
def login():
    #db.drop_all()
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        login_user(user)
        role = user.role
        return jsonify({'message': 'Logged in successfully','role':role}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.json
    print(current_user)
    post = Post(title=data['title'], content=data['content'], username=data['username'])
    db.session.add(post)
    db.session.commit()
    return jsonify({'message': 'Post created successfully'}), 201

@app.route('/api/resetPassword', methods=['POST'])
def reset_password():
    data = request.get_json()
    username = data.get('username')
    new_password = data.get('newPassword')
    
    if not username or not new_password:
        return jsonify({"error": "Missing username or password"}), 400

    user = User.query.filter_by(username=username).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update the user's password
    user.password = new_password
    db.session.commit()

    return jsonify({"message": "Password successfully reset"}), 200

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def edit_post(post_id):
    data = request.json
    post = Post.query.filter_by(id=post_id).first()
    if post:
        post.title = data.get('title', post.title)
        post.content = data.get('content', post.content)
        db.session.commit()
        return jsonify({'message': 'Post updated successfully'}), 200
    return jsonify({'message': 'Post not found'}), 404

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.filter_by(id=post_id).first()
    if post:
        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    return jsonify({'message': 'Post not found'}), 404
@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if post:
        return jsonify({
            'id': post.id,
            'title': post.title,
            'content': post.content,
            'username': post.username
        }), 200
    return jsonify({'message': 'Post not found'}), 404
@app.route('/api/verifySecurity', methods=['POST'])
def verify_security_question():
    data = request.get_json()
    username = data.get('username')
    question = data.get('question')
    answer = data.get('answer')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    print(user.security_question,question, user.security_answer, answer)
    if (user.security_question == question and user.security_answer == answer ):
        return jsonify({"message": "Security question and answer verified"}), 200
    else:
        return jsonify({"error": "Invalid security question or answer"}), 400
@app.route('/api/users', methods=['POST'])
def delete_user():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    return jsonify({'message': 'User not found'}), 404
@app.route('/api/users/promote', methods=['POST'])
def promote_user():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user:
        user.role = 'moderator'
        db.session.commit()
        return jsonify({'message': f'User {user.username} promoted to moderator'}), 200
    return jsonify({'message': 'User not found'}), 404
@app.route('/api/users/edit-profile', methods=['PUT'])
def edit_profile():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    print(data['security_question'])
    user.security_question = data['security_question']
    user.security_answer = data['security_answer']
    user.password = data['password']  
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200
@app.route('/api/profile/<string:username>', methods=['GET'])
def get_profile(username):
    user = User.query.filter_by(username=username).first()
    user_data = {
        "username": user.username,
        "security_question": user.security_question,
        "security_answer": user.security_answer,
    }
    return jsonify(user_data), 200
@app.route('/api/role/<string:username>', methods=['GET'])
def get_role(username):
    user = User.query.filter_by(username=username).first()
    user_data = {
        "username": user.username,
        "role":user.role
    }
    return jsonify(user_data), 200
@app.route('/api/allposts', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    posts_list = [{
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'username': post.username 
    } for post in posts]
    return jsonify(posts_list), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)