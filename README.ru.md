# jQuery Factory
[![Build Status](https://img.shields.io/travis/peremenov/jquery-factory.svg)](https://travis-ci.org/peremenov/jquery-factory)
[![npm version](https://img.shields.io/npm/v/jquery-factory.svg)](https://www.npmjs.com/package/jquery-factory)
[![bower version](https://img.shields.io/bower/v/jquery-factory.svg)](http://bower.io/search/?q=jquery-factory)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/af063b6571ee43afa16b858e2ca0df0c)](https://www.codacy.com/app/peremenov/jquery-factory)
[![Dependency Status](https://www.versioneye.com/nodejs/jquery-factory/badge?style=flat)](https://www.versioneye.com/nodejs/jquery-factory/)

![](logo.png)

### [In English](https://github.com/peremenov/jquery-factory/blob/master/README.md)

Простая, пегковесная, цельная фабрика для генерации jQuery плагинов. Позволяет писать плагины в классическом JavaScript стиле вместо предлагаемого [jQuery](https://learn.jquery.com/plugins/basic-plugin-creation/).

## Возможности

- Поддержка всех современных браузеров (включая мобильные браузеры)
- Поддержка Internet Explorer 7-8 (необходима jQuery 1.8 или старше)
- Поддержка jQuery начиная с версии 1.6
- Поддержка [Zepto](http://zeptojs.com/) (нужен модуль [data](https://github.com/madrobby/zepto/blob/master/src/data.js))
- Около 600 байт в сжатом виде
- Эффективное реиспользование кода при написании нескольких плагинов
- Поддкржка requirejs/webpack и amd
- Режим тестирования

## Установка

Bower

```bash
bower install --save jquery-factory
```

Npm

```bash
npm install --save jquery-factory
```

## Использование

### Использование с requirejs или webpack

```javascript
var $ = require('jquery')(window),
    newPlugin = require('jquery-factory')($);
```

### Создание плагина `$.newPlugin(pluginName, Constr, options)`

Создает новый jQuery плагин в `$.fn`-объекте с функцией-конструктором **Constr**. Фабрика принимает название плагина в виде строки **pluginName**. Если плагин с таким именем существует, будет брошена ошибка.

После создания, объект `$.fn.pluginName` содержит свойство `__constr__` с конструктором **Constr** для возможности проверки принадлежности плагина:

```javascript
$('.element').data(pluginName) instanceof $.fn.pluginName.__constr__
```

#### Конструктор

**Constr** принимает в качестве параметров `$element`, `callback` и `htmlData`.

`$element` содержит текущий jQuery-элемент

`callback` колбэк по окончанию инициализации (не рекомендуется)

`htmlData` содержит значение html-атрибута `data-<pluginname>`, если он был (например `<span data-plugin="myText"></span>`).

#### Методы

По-умолчанию, каждый вновь созданный плагин содержит методы `init`, `update` и `destroy`, которые могут быть переопределены.

`init` должен содержать привязку обработчиков, добавление классов, начальные данные и т.д.

`update` метод, используемый для обновления и изменеия состояния экземпляра плагина. Метод будет вызван, если к текущему элементу уже привязан плагин.

`destroy` метод для удаления экземпляра плагина. Используется метод [`.removeData`](http://api.jquery.com/removeData/).

Любые методы могут быть объявлены путем добавления в протопит конструктора.

#### Экземпляры плагина

Экземпляры плагина сохраняются при помощи метода [`.data`](http://api.jquery.com/data/), так что при необходимости можно обратиться к ним для тестирования или поиска зависимостей.

Включение тестов возможно путем помещения их в аргумент **callback**. **callback** примет контекст экземпляра. Он должен вернуть `true` для сохранения экземпляра в элемент или `false` для удаления.

### Примеры

#### Пустой плагин

Плагин, который ничего не делает:

```javascript
(function($) {
  var Plugin = function() {}
  $.newPlugin('plugin', Plugin);
})(jQuery);
```
Использование:

```javascript
$('.element-set').plugin();
```

#### Элемент и параметры инициализации

Плагин принимает параметры инициализации и присоединяемый элемент. Класс **opt** добавляется, когда присоединяется **plugin**.

```javascript
(function($) {
  var Plugin = function($el, opt) {
    this.$el = $el;
    this.opt = opt;
    
    this.$el.addClass(opt);
  }
  $.newPlugin('plugin', Plugin);
})(jQuery);
```

Использование:

```javascript
$('.element-set').plugin('some-class');

```

#### `init`, `update`, `destroy` методы и события

```javascript
(function($) {
  var clickHandler = function(e) {
    var self = e.data;
    e.preventDefault();
    // делаем что-либо
  }
  
  var Plugin = function($el, opt) {
    this.$el = $el;
    this.opt = $.extend({
      text : ''
    }, opt);
    
    this.init();
  }
  
  // обработчик инициализации
  Plugin.prototype.init = function() {
    this.$el
      .on('click', this, clickHandler)
      .text(this.opt.text);
  }
  
  // updating text option
  Plugin.prototype.update = function(opt) {
    $.extend(this.opt, opt);
    this.$el.text(this.opt.text);
  }
  
  // метод для удаления
  Plugin.prototype.destroy = function() {
    this.$el
      .off('click', clickHandler)
      .removeData('plugin');
  }
  
  // произвольный метод
  Plugin.prototype.smartMove = function() {
    this.$el
      .toggleClass('smart-class');
  }
  
  $.newPlugin('plugin', Plugin);
})(jQuery);
```

Использование:

```javascript
// создание
$('.element-set').plugin({
  text : 'This is new instance of "plugin"'
});

// обновление
$('.element-set').plugin('update', {
  text : 'blah!'
});

// обновление (другой способ)
$('.element-set').plugin({
  text : 'Blah-blah!'
});

// вызов произвольного метода
$('.element-set').plugin('smartMove');

// удаление плагина
$('.element-set').plugin('destroy');

```

Больше примеров доступно в [tests](https://github.com/peremenov/jquery-factory/blob/master/test/tests.js)


## В планах

- Тесты совместимости с [Zepto](http://zeptojs.com)
- Создавать экземпляры плагина с помощью `Object.create` (будет потеряна совместимость со старыми браузерами)
- Больше тестов
- Больше примеров
- Адаптация (возможно форк?) для [БЭМ](https://ru.bem.info/) процесса разработки

## Помощь проекту

Сделайте свой вклад в улучшение проекта :)

## Автор

- [Kir Peremenov](mailto:kirill@peremenov.ru)

## Благодарности

- [asg-3d](https://github.com/asg-3d)
- [KlonD90](https://github.com/KlonD90)
