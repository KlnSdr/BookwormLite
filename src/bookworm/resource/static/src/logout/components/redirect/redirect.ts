class redirect implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    this.doLogout();
    return {
      tag: "p",
      text: "Sie werden weitergeleitet...",
    };
  }

  private doLogout() {
    fetch("{{CONTEXT}}/rest/users/logout", {
      method: "GET",
    }).then((response) => {
      if (response.status === 200) {
        location.assign("{{CONTEXT}}/hades/login/");
      } else {
        alert("Logout failed");
      }
    });
  }

  public unload() {}
}
