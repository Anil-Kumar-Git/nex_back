export function handleCss() {
    return `
    .swagger-ui .topbar {
        background-color: #1e1615;
        padding: 10px 0;
    }
     .opblock-tag-section.is-open {
        background: #1e1615;
        border: 1px solid #ddd;
        padding: 20px;
        margin: 20px 0;
        border-radius: 6px;
    }
    .opblock-tag-section.is-open h3 {
        color: #fff;
    }
    .swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated {
        color: #ffff;
    }
    .opblock-summary-control {
        color: #fff;
    }
    .opblock-summary-control svg.arrow {
        fill: #fff;
    }
    .authorization__btn.unlocked svg {
        fill: #fff;
    }
    .swagger-ui .opblock-description-wrapper {
        color: #fff;
    }
    .opblock-body {
        background: #fff;
    }
    button.opblock-summary-control:focus {
        outline: 0;
    }
    .opblock-tag-section.is-open .expand-operation svg.arrow {
        fill: #fff;
    }
   `
  }

