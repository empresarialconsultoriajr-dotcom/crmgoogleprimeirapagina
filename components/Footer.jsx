import React from 'react'
import { profile } from '../data/index.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__name">{profile.name}</p>
        <p className="footer__role">{profile.role}</p>
        <p className="footer__meta">
          <span>© {new Date().getFullYear()}</span>
          <span aria-hidden="true">·</span>
          <a href={profile.siteUrl} target="_blank" rel="noopener noreferrer">
            {profile.site}
          </a>
        </p>
      </div>
    </footer>
  )
}
