<?php
$rType = $_GET['rType'];
switch ($rType) {
  case 'fetchList':
    $list = file_get_contents('data.json');
    $listJson = json_decode($list);
    header("HTTP/1.1 200 OK");
    echo json_encode($listJson);
    break;
  case 'saveList':
    $list = json_decode($_POST['toDoList']);
    $path = dirname(__FILE__) . '/data.json';
    $fp = fopen($path, 'a');
    if (!$fp) {
      header("HTTP/1.1 500 Internal Server Error");
    } else {
      ftruncate($fp, 0);
      fwrite($fp, json_encode($list));
      fclose($fp);
      header("HTTP/1.1 200 OK");
    }
    break;
  default:
    header("HTTP/1.1 400 Bad Request");
    break;
}