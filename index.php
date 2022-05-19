<?php

$country = 'ua';
$item_id = 0;
$item_string = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$country = filter_input(INPUT_POST, 'country');
	if (!in_array($country, ['ua', 'jp'])) $country = 'ua';

	$item_id = filter_input(INPUT_POST, 'item', FILTER_VALIDATE_INT);
	$item_string = filter_input(INPUT_POST, 'item-string');
}

// ————————————————————————————————————————————————————————————————————————————————
// Full document
// ————————————————————————————————————————————————————————————————————————————————
?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Ajax-populated options</title>

	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet">

	<link href="dev/odeselect.css?v=<?=filemtime('dev/odeselect.css')?>" rel="stylesheet">
	<script src="dev/odeselect.js?v=<?=filemtime('dev/odeselect.js')?>"></script>
</head>
<body>
	<form method="post" class="m-5 d-flex flex-wrap justify-content-center">
		<div><div class="input-group">
			<label for="editor-country" class="input-group-text">Additional factor</label>
			<select id="editor-country" name="country" data-os-for="example-1" data-os-factor="country">
				<option value="ua">Ukraine</option>
				<option value="jp">Japan</option>
			</select>
		</div></div>	
		<div><div class="input-group">
			<label for="editor-string" class="input-group-text">Item</label>
			<div>
				<input type="hidden" id="item-id" name="item" value="" data-os="example-1" data-os-url="options.php" data-os-minlength="1">
				<input type="text" id="editor-string" name="item-string" value="" class="form-control" placeholder="Type here...">
				<script>document.getElementById('item-id').odeselect()</script>
			</div>
		</div></div>
		<div>
			<input type="submit" value="Send" class="btn btn-primary">
		</div>
	</form>

	<?php if ($_SERVER['REQUEST_METHOD'] === 'POST'): ?>
	<div class="card">
		<div class="card-body">
			<table class="table table-sm table-striped table-hover" style="table-layout: fixed;">
				<tbody>
					<tr>
						<th>Additional factor</th>
						<th><?=e($country)?></th>
					</tr>
					<tr>
						<th>Item (id)</th>
						<th><?=e($item_id)?></th>
					</tr>
					<tr>
						<th>Item (string)</th>
						<th><?=e($item_string)?></th>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<?php endif ?>
	
	<script src="vendor/copytoclipboard.js"></script>
</body>
</html>
<?php
// ————————————————————————————————————————————————————————————————————————————————
// Functions
// ————————————————————————————————————————————————————————————————————————————————

// htmlspecialchars wrapper
function e($raw_input) { 
	if (version_compare(PHP_VERSION, '5.4.0') >= 0) {
		return htmlspecialchars($raw_input, ENT_QUOTES | ENT_HTML401, 'UTF-8'); 
	} else {
		return htmlspecialchars($raw_input, ENT_QUOTES, 'UTF-8'); 
	}
}
