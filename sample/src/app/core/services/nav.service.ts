import { Injectable } from '@angular/core';
import { FsNavService } from '@firestitch/nav';


@Injectable()
export class NavService extends FsNavService {

  public setListTitle(area, name) {
    this.setTitle(name, area);
  }

  public setDetailTitle(area, type, id, name?, image?) {

    if (id) {

      let supertitle = `Edit ${type}`;
      if (area) {
        supertitle = `${area} · ${supertitle}`;
      }

      this.setTitle(name, supertitle);
    } else {
      this.setTitle(`Create ${type}`, area);
    }

    if (image) {
      this.setComponent('image', image);
    }
  }

  /**
   * Set title on the navigation by the pattern 'Listing within an entity'
   * It means with image, title and subtitle;
   * @param {string} title
   * @param {string} subtitle
   * @param image
   */
  public setListTitleWithinEntity(title: string, subtitle: string, image) {
    this.setTitle(title, subtitle);
    if (image) {
      this.setComponent('image', image);
    }
  }

  /**
   * Set title on the navigation with parent and subparent
   * @param {string} area - main parent name (Admin, for exmaple)
   * @param {string} parent - section name (Tasks, for example)
   * @param {string} subtype - subsection name (Status, for example)
   * @param {string} name - name of the object (In progress, for example)
   * @param image - for pattern with icon/image
   */
  public setTitleWithParent(area: string, parent: string, subtype: string, name: string, image?) {
    let supertitle = name ? `Edit ${subtype}` : `Edit ${parent}`;
    let title = name ? name : `Create ${subtype}`;

    this.setTitleWithArea(area, supertitle, title, image);
  }

  /**
   * Set title on the navigation with parent and area but without additional rules with 'create' or 'edit' prefix
   * @param {string} area - main parent name
   * @param {string} title - sub section
   * @param {string} subtitle - name of the object
   * @param image - with/or without icon/image
   */
  public setTitleWithArea(area: string, title: string, subtitle: string, image?) {
    const supertitle = area ? `${area} · ${title}` : title;
    this.setTitle(subtitle, supertitle);

    if (image) {
      this.setComponent('image', image);
    }
  }
}
