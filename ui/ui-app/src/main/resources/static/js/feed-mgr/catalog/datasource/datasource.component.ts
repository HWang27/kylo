import * as angular from "angular";

import {Component, Input, OnInit} from "@angular/core";
import {StateRegistry, StateService} from "@uirouter/angular";

import {ConnectorTab} from "../api/models/connector-tab";
import {DataSource} from '../api/models/datasource';
import {SelectionService} from '../api/services/selection.service';
import {Node} from '../api/models/node'

/**
 * Displays tabs for configuring a data set (or connection).
 */
@Component({
    selector: "catalog-dataset",
    templateUrl: "js/feed-mgr/catalog/datasource/datasource.component.html"
})
export class DatasourceComponent implements OnInit {

    static readonly LOADER = "DatasourceComponent.LOADER";

    /**
     * Data set to be configured
     */
    @Input()
    public datasource: DataSource;

    /**
     * List of tabs
     */
    tabs: ConnectorTab[] = [];

    constructor(private state: StateService, private stateRegistry: StateRegistry, private selectionService: SelectionService) {
    }

    public ngOnInit() {
        // Add tabs and register router states
        this.selectionService.reset(this.datasource.id);
        if (this.datasource.connector.tabs) {
            this.tabs = angular.copy(this.datasource.connector.tabs);
            for (let tab of this.tabs) {
                if (tab.state) {
                    this.stateRegistry.register(tab.state);
                }
            }
        }

        // Add system tabs
        this.tabs.push({label: "Preview", sref: ".preview"});

        // Go to the first tab
        this.state.go(this.tabs[0].sref, {}, {location: "replace"});
    }

    isDisabled(tab: ConnectorTab) {
        let disabled = false;
        if (tab.sref === ".preview") {
            //disable preview until there is a selection
            const root: Node = <Node>this.selectionService.get(this.datasource.id);
            disabled = root ? root.countSelectedDescendants() === 0 : false;
        }
        return disabled;
    }
}
