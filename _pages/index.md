---
layout: home
title: Home
id: home
permalink: /
---

<div class="wrap">

  <p><a href="#" class="muted font-ui">Latest</a></p>

  <div>
    <a href="#" class="plain">
      <h2>Your latest article title</h2>
      <div class="metadata muted small pb font-ui">
        <time datetime="2026-02-27T00:00:00+00:00">February 27, 2026</time> · <span class="reading-time" title="Estimated read time">5 minute read</span>
      </div>
      <div class="small muted">
        A brief excerpt of your latest article goes here. Keep&nbsp;reading&nbsp;→
      </div>  
    </a>
  </div>

  <hr class="mn2 ms2">

  <p><a href="#" class="muted internal-link font-ui">Topics</a></p>

  <div class="line-height-loose">
    {% for topic in site.data.topics %}
      <a href="/topics/{{ topic }}" class="internal-link">{{ topic }}</a><span class="muted">,</span>
    {% endfor %}
  </div>

  <hr class="mn2 ms2">

  <p class="muted font-ui"><a href="#" class="muted internal-link">Writing</a></p>

  <ul class="list-plain tabular-nums">
    {% assign posts = site.posts | sort: "date" | reverse %}
    {% for post in posts %}
      <li><a href="{{ post.url }}" class="internal-link plain"><flex class="align-baseline"><span class="muted ppr flex-shrink small mh nowrap font-ui">{{ post.date | date: "%Y · %m" }}</span> <u>{{ post.title }}</u></flex></a></li>
    {% endfor %}
    
    {% assign notes = site.notes | sort: "date" | reverse %}
    {% for note in notes %}
      <li><a href="{{ note.url }}" class="internal-link plain"><flex class="align-baseline"><span class="muted ppr flex-shrink small mh nowrap font-ui">{% if note.date %}{{ note.date | date: "%Y · %m" }}{% else %}—{% endif %}</span> <u>{{ note.title }}</u></flex></a></li>
    {% endfor %}
  </ul>

</div>
