$(document).ready(function () {
	var $btn = $("#btn"),
		$list = $("#list");

	var clickChan = ASQ.csp.chan();
	var messageChan = ASQ.csp.chan();

	$btn.click(clickListener);

	function clickListener(evn) {
		ASQ.csp.putAsync(clickChan, evn)
	}

	function* clickConsumer() {
		while (true) {
			var evn = yield ASQ.csp.take(clickChan)
			console.log('evn :>> ', evn);
			yield ASQ.csp.put(messageChan, "click")
		}
	}

	function* messageConsumer() {
		while (true) {
			yield ASQ.csp.take(ASQ.csp.timeout(1000))
			var message = yield ASQ.csp.take(messageChan)
			$list.append($("<div>" + message + "</div>"));
			console.log('message :>> ', message);
		}
	}

	ASQ().runner(
		ASQ.csp.go(clickConsumer),
		ASQ.csp.go(messageConsumer)
	)
	// Hint: ASQ().runner( .. )

	// TODO: setup sampling go-routine and
	// channel, populate $list
});
