# read-system-fonts
> Forked due to inactivity on [node-system-fonts](https://github.com/jgilsaa/node-system-fonts).


A C++ module for Node.js providing access to the system font catalog.

## Features

* List all available fonts
* Find fonts with specified characteristics
* Font substitution when characters are missing

## Platforms

* Mac OS X 10.5 and later supported via [CoreText](https://developer.apple.com/library/mac/documentation/Carbon/reference/CoreText_Framework_Ref/_index.html)
* Windows 7 and later supported via [DirectWrite](http://msdn.microsoft.com/en-us/library/windows/desktop/dd368038(v=vs.85).aspx)
* Linux supported via [fontconfig](http://www.freedesktop.org/software/fontconfig)

## Installation

Installation of the `read-system-fonts` module is via npm:

    npm install https://github.com/posit-dev/read-system-fonts#v1.0.2

On Linux, you also may need to install the `libfontconfig-dev` package, for example:

    sudo apt-get install libfontconfig-dev

## API

You load the `read-system-fonts` module using `require` as with all Node modules:

```javascript
var fontManager = require('read-system-fonts');
```

All of the methods exported by `read-system-fonts` have both synchronous and asynchronous versions available.
You should generally prefer the asynchronous version as it will allow your program to continue doing other
processing while a request for fonts is processing in the background, which may be expensive depending on
the platform APIs that are available.

- [read-system-fonts](#read-system-fonts)
  - [Features](#features)
  - [Platforms](#platforms)
  - [Installation](#installation)
  - [API](#api)
    - [getAvailableFonts()](#getavailablefonts)
    - [findFonts(fontDescriptor)](#findfontsfontdescriptor)
    - [findFont(fontDescriptor)](#findfontfontdescriptor)
    - [substituteFont(postscriptName, text)](#substitutefontpostscriptname-text)
    - [Font Descriptor](#font-descriptor)
      - [Weights](#weights)
      - [Widths](#widths)
  - [License](#license)

### getAvailableFonts()

Returns an array of all [font descriptors](#font-descriptor) available on the system.

```javascript
// asynchronous API
fontManager.getAvailableFonts(function(fonts) { ... });

// synchronous API
var fonts = fontManager.getAvailableFontsSync();

// output
[ { path: '/Library/Fonts/Arial.ttf',
    postscriptName: 'ArialMT',
    family: 'Arial',
    style: 'Regular',
    weight: 400,
    width: 5,
    italic: false,
    monospace: false },
  ... ]
```

### findFonts(fontDescriptor)

Returns an array of [font descriptors](#font-descriptor) matching a query 
[font descriptor](#font-descriptor). 
The returned array may be empty if no fonts match the font descriptor.

```javascript
// asynchronous API
fontManager.findFonts({ family: 'Arial' }, function(fonts) { ... });

// synchronous API
var fonts = fontManager.findFontsSync({ family: 'Arial' });

// output
[ { path: '/Library/Fonts/Arial.ttf',
    postscriptName: 'ArialMT',
    family: 'Arial',
    style: 'Regular',
    weight: 400,
    width: 5,
    italic: false,
    monospace: false },
  { path: '/Library/Fonts/Arial Bold.ttf',
    postscriptName: 'Arial-BoldMT',
    family: 'Arial',
    style: 'Bold',
    weight: 700,
    width: 5,
    italic: false,
    monospace: false } ]
```

### findFont(fontDescriptor)

Returns a single [font descriptors](#font-descriptor) matching a query
[font descriptors](#font-descriptor) as well as possible. This method
always returns a result (never `null`), so sometimes the output will not 
exactly match the input font descriptor if not all input parameters
could be met.

```javascript
// asynchronous API
fontManager.findFont({ family: 'Arial', weight: 700 }, function(font) { ... });

// synchronous API
var font = fontManager.findFontSync({ family: 'Arial', weight: 700 });

// output
{ path: '/Library/Fonts/Arial Bold.ttf',
  postscriptName: 'Arial-BoldMT',
  family: 'Arial',
  style: 'Bold',
  weight: 700,
  width: 5,
  italic: false,
  monospace: false }
```

### substituteFont(postscriptName, text)

Substitutes the font with the given `postscriptName` with another font
that contains the characters in `text`.  If a font matching `postscriptName`
is not found, a font containing the given characters is still returned.  If
a font matching `postscriptName` *is* found, its characteristics (bold, italic, etc.)
are used to find a suitable replacement.  If the font already contains the characters
in `text`, it is not replaced and the font descriptor for the original font is returned.

```javascript
// asynchronous API
fontManager.substituteFont('TimesNewRomanPSMT', '汉字', function(font) { ... });

// synchronous API
var font = fontManager.substituteFontSync('TimesNewRomanPSMT', '汉字');

// output
{ path: '/Library/Fonts/Songti.ttc',
  postscriptName: 'STSongti-SC-Regular',
  family: 'Songti SC',
  style: 'Regular',
  weight: 400,
  width: 5,
  italic: false,
  monospace: false }
```

### Font Descriptor

Font descriptors are normal JavaScript objects that describe characteristics of
a font.  They are passed to the `findFonts` and `findFont` methods and returned by
all of the methods.  Any combination of the fields documented below can be used to 
find fonts, but all methods return full font descriptors.

| Name             | Type    | Description                                                                                                                                       |
| ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`           | string  | The path to the font file in the filesystem. **(not applicable for queries, only for results)**                                                   |
| `postscriptName` | string  | The PostScript name of the font (e.g `'Arial-BoldMT'`). This uniquely identities a font in most cases.                                            |
| `family`         | string  | The font family name (e.g `'Arial'`)                                                                                                              |
| `style`          | string  | The font style name (e.g. `'Bold'`)                                                                                                               |
| `weight`         | number  | The font weight (e.g. `400` for normal weight). Should be a multiple of 100, between 100 and 900. See [below](#weights) for weight documentation. |
| `width`          | number  | The font width (e.g. `5` for normal width). Should be an integer between 1 and 9. See [below](#widths) for width documentation.                   |
| `italic`         | boolean | Whether the font is italic or not.                                                                                                                |
| `monospace`      | boolean | Whether the font is monospace or not.                                                                                                             |

#### Weights

| Value | Name        |
| ----- | ----------- |
| 100   | Thin        |
| 200   | Ultra Light |
| 300   | Light       |
| 400   | Normal      |
| 500   | Medium      |
| 600   | Semi Bold   |
| 700   | Bold        |
| 800   | Ultra Bold  |
| 900   | Heavy       |

#### Widths

| Value | Name            |
| ----- | --------------- |
| 1     | Ultra Condensed |
| 2     | Extra Condensed |
| 3     | Condensed       |
| 4     | Semi Condensed  |
| 5     | Normal          |
| 6     | Semi Expanded   |
| 7     | Expanded        |
| 8     | Extra Expanded  |
| 9     | Ultra Expanded  |

## License

MIT
