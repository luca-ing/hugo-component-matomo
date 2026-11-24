## About

[Matomo](https://matomo.org/) tracking and opt-out for [Hugo](https://gohugo.io), without cookies and without a consent banner.

Fork of [holehan/hugo-component-matomo](https://github.com/holehan/hugo-component-matomo). It differs from upstream in how opt-out works:

- Matomo is not loaded at all if the browser sends [Global Privacy Control](https://globalprivacycontrol.org/) or Do Not Track.
- The opt-out shortcode stores a single `localStorage` flag on the site's own domain, and only when the visitor clicks it. The tracking script checks the flag before loading Matomo, and opting out reloads the page so the tracker already running stops too. No Matomo plugin and no third-party cookie are needed, and nothing is stored for visitors who never opt out.
- No polyfills and no build step: the scripts in `assets/js` are the source.

## Requirements

- [Hugo](https://gohugo.io) extended v0.120.0 or higher
- [Matomo Analytics](https://matomo.org/)

## Install component as a submodule

```sh
git submodule add https://github.com/luca-ing/hugo-component-matomo.git themes/matomo
```

### Update component

```sh
git submodule update --remote themes/matomo
```

## Usage

- Add the matomo components to your Hugo project's config.toml:

  ```toml
  theme = ["YOURTHEME", "matomo"]
  ```

- Include the tracking partial in your Hugo templates, e.g. in `footer.html`

  ```go
  {{ partial "matomo-tracking" . }}
  ```

- Add the opt-out shortcode to your privacy page

  ```markdown
  {{< matomo-optout >}}
  ```

### Configure tracking (mandatory)

Add the matomo server url and your site's tracking id to your Hugo project's params within your `config.toml`. If e.g. your matomo server is located at `example.org` and your Hugo project's site id is `1`, add the following:

```toml
[params.matomo]
url = "https://example.org"
id = 1
```

The tracker runs with `disableCookies`. Pages may push their own events into `window._paq`; when tracking is off, the queue is a plain array nobody reads.

The scripts and styles are fingerprinted, and [SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) is applied by default. If you want to disable SRI (e.g. in case your webhoster optimzes your assets automagically), add the following to your matomo config in `config.toml`:

```toml
[params.matomo]
disableSRI = true
```

### Configure opt-out

Customize the opt-out messages and button texts by adding the following to your `config.toml`. Message texts support markdown, button texts do not. `signal` is shown instead of the buttons when the browser sends Global Privacy Control or Do Not Track; `noscript` when JavaScript is off; `nostorage` when the browser refuses to store the opt-out.

```toml
[params.matomo.track]
button = "Wieder erfassen"
message = "Ihr Besuch wird gezählt."
[params.matomo.block]
button = "Nicht mehr erfassen"
message = "Sie haben widersprochen, Ihre Besuche werden *nicht* gezählt."
[params.matomo.signal]
message = "Ihr Browser sendet ein Do-not-track-Signal, Ihre Besuche werden *nicht* gezählt."
[params.matomo.noscript]
message = "JavaScript ist abgeschaltet, Ihre Besuche werden *nicht* gezählt."
[params.matomo.nostorage]
message = "Ihr Browser erlaubt dieser Website keinen Speicher, deshalb lässt sich Ihr Widerspruch nicht merken. Schalten Sie stattdessen „Global Privacy Control“ oder „Do Not Track“ ein."
```

The same keys work in a page's front matter, under `matomo:`.

### Style the opt-out component

The generated HTML looks like this; the script unhides the message and button that match the current state.

```html
<div class="MatomoOptout">
  <link rel="stylesheet" ...>
  <script ...></script>
  <div class="MatomoOptout-message MatomoOptout-message--track" hidden>...</div>
  <div class="MatomoOptout-message MatomoOptout-message--block" hidden>...</div>
  <div class="MatomoOptout-message MatomoOptout-message--signal" hidden>...</div>
  <div class="MatomoOptout-message MatomoOptout-message--nostorage" hidden>...</div>
  <noscript>...</noscript>
  <button type="button" class="MatomoOptout-button MatomoOptout-button--block" hidden>Opt out</button>
  <button type="button" class="MatomoOptout-button MatomoOptout-button--track" hidden>Opt back in</button>
</div>
```

The shipped style file, `assets/css/matomo-optout.css`, only makes sure `hidden` wins over site button styles. To replace it, create `assets/css/matomo-optout.css` in your Hugo project or theme. To leave styling to your own pipeline, set `styleFromAssets = false` within `[params.matomo]`; your styles must then hide `.MatomoOptout [hidden]`.
