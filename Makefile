run:
	docker run -d -p 3000:3000 --rm --name TicTacToe -e PORT=3000 -v "${PWD}:/app" tictactoe:latest
stop:
	docker stop TicTacToe
build:
	docker build -t tictactoe .