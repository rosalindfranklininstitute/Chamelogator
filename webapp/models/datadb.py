#from sqlalchemy.ext.associationproxy import association_proxy

from . import db

class Sessions(db.Model):
    __tablename__ = 'Sessions'

    ROWID = db.Column(db.Integer, primary_key=True)
    DateTimeUTC = db.Column(db.DateTime)
    Project = db.Column(db.Text)

    def __init__(self, session_id, date_time_utc, project='null'):
        self.ROWID = session_id
        self.DateTimeUTC = date_time_utc
        self.Project = project


class SampleDetails(db.Model):
    __tablename__ = 'SampleDetails'

    SessionId = db.Column(db.Integer, db.ForeignKey('Sessions.ROWID'), primary_key=True)
    ProteinClass = db.Column(db.Text)
    MolecularWeight = db.Column(db.Integer)
    Concentration = db.Column(db.Float)
    BufferDescription = db.Column(db.Text)
    BufferConcentration = db.Column(db.Integer)
    DetergentType = db.Column(db.Text)
    DetergentConcentration = db.Column(db.Float)
    GlycerolConcentration = db.Column(db.Integer)

    def __init__(self, session_id, protein_class, molecular_weight, concentration, buffer_desc, buffer_conc, detergent_type, detergent_conc, glycerol_conc):
        self.SessionId = session_id
        self.ProteinClass = protein_class
        self.MolecularWeight = molecular_weight
        self.Concentration = concentration
        self.BufferDescription = buffer_desc
        self.BufferConcentration = buffer_conc
        self.DetergentType = detergent_type
        self.DetergentConcentration = detergent_conc
        self.GlycerolConcentration = glycerol_conc


class Operations(db.Model):
    __tablename__ = 'Operations'

    ROWID = db.Column(db.Integer, primary_key=True)
    DateTimeUTC = db.Column(db.DateTime)
    GridId = db.Column(db.Integer, primary_key=True)
    SampleDetailsId = db.Column(db.Integer, db.ForeignKey('SampleDetails.SessionId'))

    def __init__(self, operation_id, operation_time, grid_id, sample_details_id):
        self.ROWID = operation_id
        self.DateTimeUTC = operation_time
        self.GridId = grid_id
        self.SampleDetailsId = sample_details_id


class Plunges(db.Model):
    __tablename__ = 'Plunges'

    OperationId = db.Column(db.Integer, db.ForeignKey('Operations.ROWID'), primary_key=True)
    WickingTimeUsed = db.Column(db.Time)
    Mode = db.Column(db.Integer)

    def __init__(self, operation_id, wicking_time_used, plunge_mode):
        self.OperationId = operation_id
        self.WickingTimeUsed = wicking_time_used
        self.Mode = plunge_mode


class Treatments(db.Model):
    __tablename__ = 'Treatments'

    GridId = db.Column(db.Integer, db.ForeignKey('Operations.GridId'), primary_key=True)
    GlowDischargeId = db.Column(db.Integer)

    def __init__(self, grid_id, glow_discharge_id):
        self.GridId = grid_id
        self.GlowDischargeId = glow_discharge_id


class Dispenses(db.Model):
    __tablename__ = 'Dispenses'

    OperationId = db.Column(db.Integer, db.ForeignKey('Operations.ROWID'), primary_key=True)
    SampleTimer = db.Column(db.Time)

    def __init__(self, operation_id, sample_timer):
        self.OperationId = operation_id
        self.SampleTimer = sample_timer


class Grids(db.Model):
    __tablename__ = 'Grids'

    ROWID = db.Column(db.Integer, db.ForeignKey('Operations.GridId'), primary_key=True)
    SerialNumber = db.Column(db.Text)

    def __init__(self, grid_id, serial_number):
        self.ROWID = grid_id
        self.SerialNumber = serial_number

